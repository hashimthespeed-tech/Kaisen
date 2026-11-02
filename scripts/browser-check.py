"""Optional Chromium walkthrough. Requires Python playwright and a Chromium binary.

Run after npm run build:preview: python scripts/browser-check.py
The temporary HTTP server is internal to this check and is shut down on exit.
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import json
import os
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = ROOT / 'artifacts'
ARTIFACTS.mkdir(exist_ok=True)

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass

server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(ROOT / 'dist-preview')))
Thread(target=server.serve_forever, daemon=True).start()
origin = f'http://127.0.0.1:{server.server_port}'
errors = []

def no_overflow(page):
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Horizontal overflow'

try:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'), args=['--no-sandbox'])
        context = browser.new_context(viewport={'width': 1440, 'height': 1000})
        page = context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        requests = []
        page.on('request', lambda request: requests.append(request.url))
        page.goto(origin)
        expect(page.get_by_role('heading', name='Investing, learned by doing.')).to_be_visible()
        # Verify real motion, pause/resume, visibility suspension, and scroll entrances.
        light = page.locator('.hero .light-field-one')
        before = light.evaluate("element => getComputedStyle(element).transform")
        page.wait_for_function("before => getComputedStyle(document.querySelector('.hero .light-field-one')).transform !== before", arg=before)
        page.get_by_role('button', name='Pause animations', exact=True).click()
        assert light.evaluate("element => getComputedStyle(element).animationName") == 'none'
        expect(page.locator('.app-shell')).to_have_attribute('data-motion', 'paused')
        page.get_by_role('button', name='Resume animations', exact=True).click()
        assert light.evaluate("element => getComputedStyle(element).animationName") == 'light-drift'
        for section in ['.section-intro', '.experience-columns', '.teacher-invitation-action']:
            page.locator(section).scroll_into_view_if_needed()
            expect(page.locator(section)).to_have_attribute('data-entered', 'true')
        expect(page.locator('.hero .atmosphere')).to_have_attribute('data-visible', 'false')
        assert light.evaluate("element => getComputedStyle(element).animationPlayState") == 'paused'
        page.evaluate('window.scrollTo(0, 0)')
        expect(page.locator('.hero .atmosphere')).to_have_attribute('data-visible', 'true')
        page.screenshot(path=str(ARTIFACTS / 'teacher-landing.png'), full_page=True, animations='disabled')
        chart = page.locator('.chart-line')
        monthly_path = chart.get_attribute('d')
        page.get_by_role('button', name='Show one week', exact=True).focus()
        page.keyboard.press('Space')
        expect(page.get_by_role('button', name='Show one week', exact=True)).to_have_attribute('aria-pressed', 'true')
        assert chart.get_attribute('d') != monthly_path
        expect(page.locator('.portfolio-gain')).to_contain_text('$72')
        page.locator('.chart-data summary').click()
        expect(page.get_by_role('table')).to_be_visible()
        expect(page.get_by_role('table').locator('tbody tr')).to_have_count(7)
        page.locator('.chart-data summary').click()
        page.get_by_role('button', name='Show one month', exact=True).click()
        page.get_by_role('button', name='See how it works', exact=True).click()
        expect(page.locator('#experience')).to_be_focused()
        assert '#experience' not in page.url
        page.get_by_role('link', name='Create your class').click()
        page.screenshot(path=str(ARTIFACTS / 'teacher-signup-desktop.png'), full_page=True, animations='disabled')
        page.get_by_role('button', name='Continue', exact=True).click()
        expect(page.get_by_text('Enter a name between')).to_be_visible()
        page.get_by_label('Your name', exact=True).fill('Alex Morgan')
        page.get_by_label('Email address', exact=True).fill('alex@example.com')
        page.get_by_role('button', name='Continue', exact=True).click()
        page.screenshot(path=str(ARTIFACTS / 'teacher-class-setup-desktop.png'), full_page=True, animations='disabled')
        page.get_by_label('Class name', exact=True).fill('Economics · Period 3')
        page.get_by_label('Starting virtual cash per student').fill('12500.50')
        page.get_by_role('button', name='Back', exact=False).click()
        expect(page.get_by_label('Your name', exact=True)).to_have_value('Alex Morgan')
        page.get_by_role('button', name='Continue', exact=True).click()
        expect(page.get_by_label('Class name', exact=True)).to_have_value('Economics · Period 3')
        page.get_by_role('radio', name='A list I choose').check()
        page.get_by_role('button', name='Review class').click()
        expect(page.get_by_text('Enter 1–100 ticker symbols')).to_be_visible()
        page.get_by_label('Approved ticker symbols', exact=True).fill('aapl, MSFT aapl')
        page.get_by_role('button', name='More class settings').click()
        page.get_by_role('checkbox', name='Limit a single stock').check()
        page.get_by_label('Maximum per stock (%)', exact=True).fill('25')
        page.get_by_role('checkbox', name='Add weekly virtual cash').check()
        page.get_by_label('Weekly amount ($)', exact=True).fill('75.25')
        page.get_by_label('Deposit day', exact=True).select_option('Friday')
        page.get_by_label('Start date (optional)', exact=True).fill('2026-11-10')
        page.get_by_label('End date (optional)', exact=True).fill('2026-11-01')
        page.get_by_role('button', name='Review class').click()
        expect(page.get_by_text('The end date must be')).to_be_visible()
        page.get_by_label('End date (optional)', exact=True).fill('2027-05-20')
        page.get_by_role('button', name='Review class').click()
        expect(page.get_by_text('AAPL, MSFT', exact=True)).to_be_visible()
        expect(page.get_by_text('$75.25 · Friday', exact=True)).to_be_visible()
        page.screenshot(path=str(ARTIFACTS / 'teacher-review-desktop.png'), full_page=True, animations='disabled')
        # A denied write must leave the review in place without a false success.
        page.evaluate("() => { window.originalSet = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new Error('Blocked'); }; }")
        page.get_by_role('button', name='Create preview class').click()
        expect(page.get_by_role('alert')).to_contain_text('could not be saved')
        page.evaluate('() => { Storage.prototype.setItem = window.originalSet; }')
        page.get_by_role('button', name='Create preview class').click()
        expect(page.get_by_role('heading', name='Economics · Period 3', exact=True)).to_be_visible()
        code = page.locator('.class-code').inner_text()
        assert len(code) == 8
        url = page.url
        page.screenshot(path=str(ARTIFACTS / 'teacher-workspace-desktop.png'), full_page=True, animations='disabled')
        page.reload()
        expect(page.locator('.class-code')).to_have_text(code)
        page.get_by_role('link', name='Edit settings').click()
        page.get_by_label('Class name', exact=True).fill('Economics · Fall')
        page.get_by_role('checkbox', name='Allow trading').uncheck()
        page.get_by_role('button', name='Review class').click()
        page.get_by_role('button', name='Save changes').click()
        expect(page.get_by_role('heading', name='Economics · Fall', exact=True)).to_be_visible()
        expect(page.locator('.class-code')).to_have_text(code)
        expect(page.get_by_text('Paused', exact=True)).to_be_visible()
        assert page.url == url
        page.get_by_role('link', name='All classes').click()
        page.get_by_role('link', name='Create another class').click()
        page.get_by_label('Class name', exact=True).fill('Economics · Period 4')
        page.get_by_role('button', name='Review class').click()
        page.get_by_role('button', name='Create preview class').click()
        page.get_by_role('link', name='All classes').click()
        expect(page.locator('.class-card')).to_have_count(2)
        page.goto(origin + '/#/missing')
        expect(page.get_by_role('heading', name='This page is not available.')).to_be_visible()
        # The skip link must focus content without changing the hash route.
        page.goto(origin)
        page.get_by_role('link', name='Skip to content').focus()
        page.keyboard.press('Enter')
        expect(page.locator('#main-content')).to_be_focused()
        assert not page.url.endswith('#main-content')
        no_overflow(page)
        # The portable build must not fetch fonts, scripts, or styles externally.
        assert all(request.startswith(origin) for request in requests), requests
        assert not any('/assets/' in request for request in requests), requests

        mobile = browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, device_scale_factor=1)
        mp = mobile.new_page()
        mp.on('pageerror', lambda error: errors.append(str(error)))
        mp.goto(origin + '/#/teacher/setup')
        no_overflow(mp)
        name_box = mp.get_by_label('Your name', exact=True).bounding_box()
        continue_box = mp.get_by_role('button', name='Continue', exact=True).bounding_box()
        assert name_box['y'] < 400, name_box
        assert continue_box['y'] + continue_box['height'] < 844, continue_box
        mp.screenshot(path=str(ARTIFACTS / 'teacher-signup-mobile.png'), full_page=True, animations='disabled')
        mp.get_by_label('Your name', exact=True).fill('Taylor Teacher')
        mp.get_by_label('Email address', exact=True).fill('taylor@example.com')
        mp.get_by_role('button', name='Continue', exact=True).click()
        mp.get_by_label('Class name', exact=True).fill('Personal finance')
        mp.get_by_role('button', name='More class settings').click()
        mp.get_by_role('checkbox', name='Add weekly virtual cash').check()
        no_overflow(mp)
        mp.screenshot(path=str(ARTIFACTS / 'teacher-class-setup-mobile.png'), full_page=True, animations='disabled')
        mp.get_by_role('button', name='Review class').click()
        mp.get_by_role('button', name='Create preview class').click()
        no_overflow(mp)
        mp.screenshot(path=str(ARTIFACTS / 'teacher-workspace-mobile.png'), full_page=True, animations='disabled')
        # Layouts at a small phone, tablet, and laptop size remain usable.
        for width, height in [(320, 740), (720, 500), (768, 1024), (1280, 800)]:
            mp.set_viewport_size({'width': width, 'height': height})
            mp.goto(origin)
            no_overflow(mp)
            mp.goto(origin + '/#/teacher/setup')
            no_overflow(mp)
        mp.set_viewport_size({'width': 390, 'height': 844})
        mp.goto(origin)
        mp.screenshot(path=str(ARTIFACTS / 'teacher-landing-mobile.png'), full_page=True, animations='disabled')
        # Reduced-motion users get no animated chart stroke.
        mp.emulate_media(reduced_motion='reduce')
        expect(mp.get_by_role('button', name='Animations off: reduced motion preference')).to_be_disabled()
        assert mp.locator('.hero .light-field-one').evaluate("element => getComputedStyle(element).animationName") == 'none'
        assert mp.locator('.chart-line').evaluate("element => getComputedStyle(element).animationName") == 'none'
        # Corrupt data is preserved; the user sees a recovery explanation.
        mp.evaluate("localStorage.setItem('reign.teacher-prototype.v1', 'broken')")
        mp.reload()
        expect(mp.get_by_role('heading', name="Let's keep your work safe.")).to_be_visible()
        assert mp.evaluate("localStorage.getItem('reign.teacher-prototype.v1')") == 'broken'
        assert not errors, errors
        browser.close()
        print(json.dumps({'status': 'passed', 'browser_errors': errors, 'screenshots': str(ARTIFACTS), 'checks': ['validation', 'back navigation', 'conditional controls', 'failed save', 'create', 'reload persistence', 'edit identity', 'multiple classes', 'route recovery', 'skip link', 'portable assets', 'mobile', 'sample chart periods and table', 'product section navigation', '320–1440px responsive layouts including 200% equivalent reflow', 'continuous motion', 'pause/resume', 'offscreen suspension', 'scroll entrances', 'reduced motion', 'corrupt data recovery']}))
finally:
    server.shutdown()
    server.server_close()
