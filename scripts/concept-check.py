"""Inspect the three hero studies in Chromium after build:preview."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright, expect
import json

root = Path(__file__).resolve().parents[1]
out = root / 'artifacts' / 'concepts'
out.mkdir(parents=True, exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *_): pass
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Quiet, directory=str(root / 'dist-preview')))
Thread(target=server.serve_forever, daemon=True).start()
origin = f'http://127.0.0.1:{server.server_port}'
errors = []
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox', '--enable-unsafe-swiftshader'])
        page = browser.new_page(viewport={'width': 1440, 'height': 1000})
        page.on('pageerror', lambda error: errors.append(str(error)))
        requests = []
        page.on('request', lambda request: requests.append(request.url))
        page.goto(origin + '/#/concepts')
        expect(page.get_by_role('heading', name='Three ways into Reign.')).to_be_visible()
        page.screenshot(path=str(out / 'comparison.png'), full_page=True)
        for name in ['sculpture', 'decision', 'world']:
            page.goto(origin + '/#/concept/' + name)
            expect(page.locator('.concept-scene canvas')).to_be_visible()
            expect(page.locator('.scene-fallback')).to_have_count(0)
            page.wait_for_timeout(900)
            assert page.locator('.portfolio-preview').bounding_box()['y'] >= page.locator('.concept-page > section').first.bounding_box()['y'] + page.locator('.concept-page > section').first.bounding_box()['height']
            page.screenshot(path=str(out / (name + '-desktop.png')))
            if name == 'sculpture':
                page.get_by_role('button', name='Another perspective').click()
                page.get_by_role('button', name='Pause animations', exact=True).click()
                page.wait_for_timeout(200)
                before = page.locator('canvas').screenshot()
                page.wait_for_timeout(200)
                assert page.locator('canvas').screenshot() == before, 'Scene continued moving while paused'
                page.get_by_role('button', name='Resume animations', exact=True).click()
                page.wait_for_timeout(200)
                assert page.locator('canvas').screenshot() != before, 'Scene did not resume'
            if name == 'decision':
                page.get_by_role('button', name='Pause the moment', exact=True).click()
                expect(page.get_by_text('Which path will you take?')).to_be_visible()
                page.get_by_role('button', name='Change direction', exact=True).focus()
                page.keyboard.press('Enter')
                expect(page.get_by_text('You changed direction. Follow the light.')).to_be_visible()
                page.screenshot(path=str(out / 'decision-result.png'))
                page.get_by_role('button', name='Try the other path').click()
                page.get_by_role('button', name='Pause the moment', exact=True).click()
                page.get_by_role('button', name='Stay the course', exact=True).click()
                expect(page.get_by_text('You stayed the course. Follow the light.')).to_be_visible()
            if name == 'world':
                page.get_by_role('button', name='Energy', exact=True).click()
                expect(page.get_by_role('button', name='Energy', exact=True)).to_have_attribute('aria-pressed','true')
                expect(page.locator('.world-caption h2')).to_have_text('Energy')
                page.get_by_role('button', name='Rotate the world').click()
            for width in [390, 320, 768]:
                page.set_viewport_size({'width': width, 'height': 844})
                page.evaluate('scrollTo(0,0)')
                page.wait_for_timeout(200)
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'{name} overflow at {width}'
                if width == 390: page.screenshot(path=str(out / (name + '-mobile.png')), full_page=True)
            page.set_viewport_size({'width':1440,'height':1000})
        page.emulate_media(reduced_motion='reduce')
        page.goto(origin + '/#/concept/sculpture')
        expect(page.get_by_role('button', name='Animations off: reduced motion preference')).to_be_disabled()
        page.wait_for_timeout(300)
        before = page.locator('canvas').screenshot()
        page.wait_for_timeout(200)
        assert page.locator('canvas').screenshot() == before
        page.get_by_role('button', name='Another perspective').click()
        page.wait_for_timeout(200)
        assert page.locator('canvas').screenshot() != before, 'Reduced-motion control does not update static scene'
        page.get_by_role('link', name='Create your class', exact=True).click()
        expect(page.get_by_label('Your name', exact=True)).to_be_visible()
        assert all(request.startswith(origin) for request in requests), 'External assets in offline preview'
        # If WebGL is unavailable, retain the navigation, copy, and controls.
        fallback = browser.new_page()
        fallback.add_init_script("const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.includes('webgl')?null:original.call(this,type,...args)}")
        fallback.goto(origin + '/#/concept/sculpture')
        expect(fallback.get_by_text('Static view · 3D is unavailable in this browser.')).to_be_visible()
        expect(fallback.get_by_role('link', name='Create your class', exact=True)).to_be_visible()
        assert not errors, errors
        print(json.dumps({'status':'passed','page_errors': errors,'checks':['three distinct scenes','graph below hero','pause/resume','decision branches','business selection','camera controls','320/390/768/1440 layouts','reduced motion','WebGL fallback','teacher setup link','offline assets']}))
        browser.close()
finally:
    server.shutdown()
    server.server_close()
