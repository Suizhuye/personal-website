from playwright.sync_api import sync_playwright
import os

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})

    # === 首页 - 浅色模式 ===
    page.goto('file://' + os.path.abspath('index.html'))
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1500)
    page.screenshot(path='preview-light-home.png', full_page=True)

    # === 首页 - 暗色模式 ===
    page.evaluate('document.documentElement.setAttribute("data-theme", "dark")')
    page.wait_for_timeout(800)
    page.screenshot(path='preview-dark-home.png', full_page=True)

    # === Resume - 暗色模式 ===
    page.goto('file://' + os.path.abspath('resume.html'))
    page.wait_for_load_state('networkidle')
    page.evaluate('document.documentElement.setAttribute("data-theme", "dark")')
    page.wait_for_timeout(800)
    page.screenshot(path='preview-dark-resume.png', full_page=True)

    # === Portfolio - 暗色模式 ===
    page.goto('file://' + os.path.abspath('portfolio.html'))
    page.wait_for_load_state('networkidle')
    page.evaluate('document.documentElement.setAttribute("data-theme", "dark")')
    page.wait_for_timeout(800)
    page.screenshot(path='preview-dark-portfolio.png', full_page=True)

    # === Taste - 暗色模式 ===
    page.goto('file://' + os.path.abspath('taste.html'))
    page.wait_for_load_state('networkidle')
    page.evaluate('document.documentElement.setAttribute("data-theme", "dark")')
    page.wait_for_timeout(800)
    page.screenshot(path='preview-dark-taste.png', full_page=True)

    print('Done! Screenshots saved:')
    print('  preview-light-home.png   (首页 浅色)')
    print('  preview-dark-home.png     (首页 暗色)')
    print('  preview-dark-resume.png   (Resume 暗色)')
    print('  preview-dark-portfolio.png (Portfolio 暗色)')
    print('  preview-dark-taste.png    (Taste 暗色)')
    browser.close()
