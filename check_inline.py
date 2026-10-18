from pathlib import Path
import asyncio, base64, re
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright
ROOT=Path('/mnt/data/_white_portfolio_work')
html=(ROOT/'projects.html').read_text()
soup=BeautifulSoup(html,'html.parser')
for s in soup.select('script[src]'): s.decompose()
for x in soup.select('link[rel="stylesheet"]'): x.decompose()
for x in soup.select('img[src]'):
 path=ROOT/x['src']; x['src']='data:image/webp;base64,'+base64.b64encode(path.read_bytes()).decode()
style=soup.new_tag('style');style.string=(ROOT/'styles.css').read_text();soup.head.append(style)
script=soup.new_tag('script');script.string=(ROOT/'script.js').read_text();soup.body.append(script)
html=str(soup)
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  for w,h,label in [(1440,900,'desktop'),(390,844,'mobile'),(768,1024,'tablet')]:
   pg=await b.new_page(viewport={'width':w,'height':h})
   errs=[]
   pg.on('pageerror',lambda e: errs.append(str(e)))
   await pg.set_content(html,wait_until='domcontentloaded',timeout=30000)
   await pg.wait_for_timeout(550)
   counts=await pg.evaluate('''() => ({p:document.querySelectorAll('.project-panel').length, scrollWidth:document.documentElement.scrollWidth,width:innerWidth, loaded:[...document.querySelectorAll('.project-real-image img')].filter(x=>x.complete&&x.naturalWidth>0).length, reel:document.querySelector('.projects-reel').offsetHeight})''')
   print(label, counts,'errors',errs)
   await pg.screenshot(path=str(ROOT/f'white-projects-{label}.png'))
   if w>700:
    await pg.evaluate('''() => {const r=document.querySelector('.projects-reel'); const d=r.offsetHeight-(innerHeight-parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header')));scrollTo({top:r.getBoundingClientRect().top+scrollY + d/12,behavior:'instant'})}''')
    await pg.wait_for_timeout(200)
    print('crossfade',await pg.evaluate('''() => [...document.querySelectorAll('.project-panel')].map(x=>x.style.opacity)'''))
    await pg.screenshot(path=str(ROOT/f'white-crossfade-{label}.png'))
   else:
    await pg.evaluate('''() => {document.querySelector('#project-02').scrollIntoView({behavior:'instant'});}''')
    await pg.wait_for_timeout(350)
    await pg.screenshot(path=str(ROOT/'white-mobile-project.png'))
   await pg.close()
  await b.close()
asyncio.run(main())
