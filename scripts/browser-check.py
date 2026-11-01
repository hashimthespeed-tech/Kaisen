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
        expect(page.get_by_role('heading', name='The market is real.')).to_be_visible()
        page.screenshot(path=str(ARTIFACTS / 'teacher-landing.png'), full_page=True)
        page.get_by_role('link', name='Create your class').click()
        page.get_by_role('button', name='Continue', exact=True).click()
        expect(page.get_by_text('Enter a name between')).to_be_visible()
        page.get_by_label('Your name', exact=True).fill('Alex Morgan')
        page.get_by_label('Email address', exact=True).fill('alex@example.com')
        page.get_by_role('button', name='Continue', exact=True).click()
        page.screenshot(path=str(ARTIFACTS / 'teacher-class-setup-desktop.png'), full_page=True)
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
        page.screenshot(path=str(ARTIFACTS / 'teacher-review-desktop.png'), full_page=True)
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
        page.screenshot(path=str(ARTIFACTS / 'teacher-workspace-desktop.png'), full_page=True)
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
        mp.get_by_label('Your name', exact=True).fill('Taylor Teacher')
        mp.get_by_label('Email address', exact=True).fill('taylor@example.com')
        mp.get_by_role('button', name='Continue', exact=True).click()
        mp.get_by_label('Class name', exact=True).fill('Personal finance')
        mp.get_by_role('button', name='More class settings').click()
        mp.get_by_role('checkbox', name='Add weekly virtual cash').check()
        no_overflow(mp)
        mp.screenshot(path=str(ARTIFACTS / 'teacher-class-setup-mobile.png'), full_page=True)
        mp.get_by_role('button', name='Review class').click()
        mp.get_by_role('button', name='Create preview class').click()
        no_overflow(mp)
        mp.screenshot(path=str(ARTIFACTS / 'teacher-workspace-mobile.png'), full_page=True)
        # Corrupt data is preserved; the user sees a recovery explanation.
        mp.evaluate("localStorage.setItem('reign.teacher-prototype.v1', 'broken')")
        mp.reload()
        expect(mp.get_by_role('heading', name="Let's keep your work safe.")).to_be_visible()
        assert mp.evaluate("localStorage.getItem('reign.teacher-prototype.v1')") == 'broken'
        assert not errors, errors
        browser.close()
        print(json.dumps({'status': 'passed', 'browser_errors': errors, 'screenshots': str(ARTIFACTS), 'checks': ['validation', 'back navigation', 'conditional controls', 'failed save', 'create', 'reload persistence', 'edit identity', 'multiple classes', 'route recovery', 'skip link', 'portable assets', 'mobile', 'corrupt data recovery']}))
finally:
    server.shutdown()
    server.server_close()
