import asyncio
import threading
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from pathlib import Path
from playwright.async_api import async_playwright
root=Path('/mnt/data/_white_portfolio_work')
async def main():
 server=ThreadingHTTPServer(('127.0.0.1', 0),partial(SimpleHTTPRequestHandler,directory=str(root)))
 threading.Thread(target=server.serve_forever,daemon=True).start()
 base=f'http://127.0.0.1:{server.server_port}'
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox','--disable-dev-shm-usage'])
  for w,h,label in [(1440,900,'desktop'),(390,844,'mobile'),(768,1024,'tablet')]:
   page=await browser.new_page(viewport={'width':w,'height':h}, device_scale_factor=1)
   errors=[]
   page.on('pageerror',lambda err: errors.append(str(err)))
   await page.goto(base+'/projects.html',wait_until='domcontentloaded')
   await page.wait_for_timeout(450)
   await page.screenshot(path=str(root/f'projects-{label}.png'))
   d=await page.evaluate('''() => ({bodyWidth:document.body.scrollWidth, innerWidth:innerWidth, projectCount:document.querySelectorAll('.project-panel').length, firstOpacity:getComputedStyle(document.querySelector('.project-panel')).opacity, stageHeight:document.querySelector('.projects-reel').offsetHeight, images:[...document.querySelectorAll('.project-real-image img')].map(x=>({loaded:x.complete && x.naturalWidth>0,src:x.currentSrc}))})''')
   print(label, 'errors',errors, 'bodyWidth',d['bodyWidth'], 'innerWidth',d['innerWidth'], 'projectCount',d['projectCount'], 'firstOpacity',d['firstOpacity'], 'stageHeight',d['stageHeight'], 'images',sum(i['loaded'] for i in d['images']))
   if w>700:
    result=await page.evaluate('''() => {const reel=document.querySelector('.projects-reel'); const available=Math.max(1,reel.offsetHeight-(innerHeight-parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header')))); scrollTo(0,reel.getBoundingClientRect().top+scrollY+available/12);return {available,scrollY};}''')
    await page.wait_for_timeout(600)
    vals=await page.evaluate('''() => [...document.querySelectorAll('.project-panel')].map(x=>Number(x.style.opacity))''')
    print(' CROSSFADE',result,vals)
    await page.screenshot(path=str(root/f'crossfade-{label}.png'))
   else:
    await page.locator('.mobile-toggle').click()
    print(' MOBILE MENU',await page.locator('#mobile-navigation').is_visible())
   await page.close()
  await browser.close()
asyncio.run(main())
