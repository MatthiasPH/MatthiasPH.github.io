import fitz,io
from PIL import Image, ImageOps, ImageFilter,ImageDraw
from pathlib import Path
DOC=fitz.open('/mnt/data/Engineering Portfolio - Matthais Paterson Hawes(1).pdf')
DEST=Path('/mnt/data/_white_portfolio_work/assets')
PAGES=[('quadruped.webp',1),('rc-car.webp',2),('dowel-mounts.webp',3),('warman-concept.webp',4),('modular-rocket.webp',5),('automatic-bin.webp',6),('control-board.webp',7)]
W,H=1200,870

def extracted(page):
 out=[]
 for e in DOC[page].get_images(full=True):
  obj=DOC.extract_image(e[0]); im=Image.open(io.BytesIO(obj['image']));out.append(im.convert('RGB'))
 return out

def contain_on(img,frame,color=(234,238,241),margin=0):
 w,h=frame.size
 scaled=ImageOps.contain(img,(w-2*margin,h-2*margin),Image.Resampling.LANCZOS)
 x=(w-scaled.width)//2;y=(h-scaled.height)//2
 frame.paste(scaled,(x,y));return frame

for name,page in PAGES:
 originals=extracted(page)
 cv=Image.new('RGB',(W,H),(235,239,242))
 if len(originals)==1:
  img=originals[0]
  if img.height>img.width*1.12:
   # understated tonal backdrop from the same authentic image
   bg=ImageOps.fit(img,(W,H),Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(40))
   overlay=Image.new('RGB',(W,H),(226,231,235));cv=Image.blend(bg,overlay,.8)
   im=ImageOps.contain(img,(int(H*.79),H-85),Image.Resampling.LANCZOS)
   # subtle pale shadow
   x=(W-im.width)//2;y=(H-im.height)//2
   shadow=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(shadow)
   d.rounded_rectangle((x+8,y+9,x+im.width+12,y+im.height+13),radius=8,fill=(55,67,88,43))
   shadow=shadow.filter(ImageFilter.GaussianBlur(13))
   cv=Image.alpha_composite(cv.convert('RGBA'),shadow)
   cv.paste(im,(x,y));cv=cv.convert('RGB')
  else: cv=contain_on(img,cv,margin=35)
 elif len(originals)==2:
  # original CAD/render and physical prototype photo, side by side
  left=Image.new('RGB',(745,800),(235,239,242));right=Image.new('RGB',(390,800),(235,239,242))
  contain_on(originals[0],left,margin=7);contain_on(originals[1],right,margin=7)
  cv.paste(left,(24,36));cv.paste(right,(784,36))
  dr=ImageDraw.Draw(cv);dr.line([(770,48),(770,822)],fill=(211,219,223),width=2)
 cv.save(DEST/name,'WEBP',quality=90,method=6)
 print(name,len(originals),originals[0].size, (DEST/name).stat().st_size)
