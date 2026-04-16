from playwright.sync_api import sync_playwright
import os

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('file://' + os.path.abspath('index.html'))
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(2000)

    errors = []
    def handle_console(msg):
        if msg.type == 'error':
            errors.append(msg.text)
    page.on('console', handle_console)

    page.screenshot(path='page-check.png', full_page=True)

    print('=== Element Visibility Check ===')
    checks = [
        ('navbar', '.navbar'),
        ('hero title', 'h1'),
        ('typing target', '#typing-target'),
        ('stats bar', '.stats-bar'),
        ('hero gallery', '.hero-gallery'),
        ('contact card', '.contact-card'),
    ]
    for name, sel in checks:
        el = page.query_selector(sel)
        if el:
            visible = el.is_visible()
            box = el.bounding_box() if visible else None
            print(f'  {"✅" if visible else "🔴"} {name}: visible={visible} box={box}')
        else:
            print(f'  ❌ {name}: NOT FOUND ({sel})')

    if errors:
        print(f'\n=== JS Errors ({len(errors)}) ===')
        for e in errors[:10]:
            print(f'  ⚠️  {e}')
    else:
        print('\n✅ No JS errors detected')

    body_style = page.evaluate('''() => {
        const body = document.body;
        const cs = getComputedStyle(body);
        return {
            display: cs.display,
            visibility: cs.visibility,
            opacity: cs.opacity,
            color: cs.color,
            backgroundColor: cs.backgroundColor
        }
    }''')
    print(f'\n=== Body Styles ===')
    for k, v in body_style.items():
        print(f'  {k}: {v}')

    browser.close()
