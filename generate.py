from bs4 import BeautifulSoup
from pathlib import Path
import shutil, re
ROOT=Path('/mnt/data/_white_portfolio_work')
ASSETS=ROOT/'assets'
SOURCE=Path('/mnt/data/_working_projects/assets')

projects=[
 dict(title='Quadruped Robot — Version 2', short='Quadruped Robot V2', sector='ROBOTICS / EMBEDDED SYSTEMS', image='quadruped.webp', alt='Photo of the assembled quadruped robot prototype with sensors and wiring', overview='I redesigned my first walking robot into an eight-servo quadruped with independently controlled hip and knee joints. An ESP32-C3 coordinates the gait, while onboard sensing provides a platform for obstacle detection and future autonomous behaviours.', challenge='Coordinate two joints per leg while keeping the chassis and electronics practical to assemble, calibrate and debug.', process='Developed multi-servo gait sequences, calibrated servo centres and travel limits, and refined power distribution and cable routing.', result='Assembled a more capable second-version platform with greater control over foot placement, body motion and future sensor experiments.', tags=['ESP32-C3','C/C++','8-SERVO GAIT','3D PRINTING']),
 dict(title='Custom RC Car', short='Custom RC Car', sector='MECHANICAL DESIGN / DRIVETRAIN', image='rc-car.webp', alt='Photo of custom three-dimensional printed RC car chassis and gearbox assembly', overview='I designed and built an RC car with a 3D-printed chassis and electric drivetrain. The work combined CAD, gear calculations, printed gearbox and motor mounts, shaft support, assembly and repeated physical testing.', challenge='Package a compact geartrain while keeping shafts aligned, moving parts supported and friction under control.', process='Calculated gear ratios and centre distances, worked through backlash and bearing support, and revised printed mounts based on assembly tests.', result='A modular drivetrain prototype that made the effects of tolerances, stiffness and print orientation visible in real hardware.', tags=['CAD','GEARTRAIN','FDM PRINTING','TESTING']),
 dict(title='Modular Dowel Storage Mounts', short='Modular Dowel Mounts', sector='PARAMETRIC CAD / MANUFACTURING', image='dowel-mounts.webp', alt='CAD render of two custom 3D printed modular mounts with circular dowel holes', overview='I developed a family of printed mounts for 20 mm wooden dowels, allowing the same parts to support different modular storage and bracing arrangements. The design is inexpensive, replaceable and adaptable.', challenge='Achieve reliable locating and holding fits despite dimensional variation in FDM-printed components.', process='Iterated small fit-test pieces, varied clearances and print orientation, and used wall thickness, fillets and braces to improve the load path.', result='Repeatable mount geometries with practical slip and interference fit tolerances, reducing wasted prints during development.', tags=['FUSION 360','TOLERANCES','PARAMETRIC CAD','FDM']),
 dict(title='Warman Project Concept Robot', short='Warman Robot Concept', sector='UNIVERSITY / CONCEPT DESIGN', image='warman-concept.webp', alt='CAD render of wheeled Warman robot with hopper and multi-link gripper arm', overview='For a university Warman design project, I produced a detailed CAD concept with a mobile chassis, collection hopper and multi-link gripper arm. This concept was not selected for the final build, but it was a valuable exercise in mechanism layout and system integration.', challenge='Fit multiple moving subsystems into one machine envelope without ignoring real assembly clearances or access.', process='Built the mechanical assembly, checked interfaces and interference, and considered fasteners, supports and manufacturing sequence.', result='A coherent digital concept useful for evaluating reach, packaging and integration risks before physical fabrication.', tags=['SOLIDWORKS','ASSEMBLIES','MECHANISMS','DESIGN FOR ASSEMBLY']),
 dict(title='Modular Two-Stage Rocket', short='Modular Rocket', sector='CAD / 3D-PRINTED PROTOTYPE', image='modular-rocket.webp', alt='CAD render and photograph of a modular 3D-printed rocket prototype', overview='I designed the first iteration of a small modular two-stage rocket in Fusion 360 and assembled a full-size printed prototype. The first stage uses fins for passive stability; gyroscope-controlled thrust vectoring was a proposed second-stage concept, not an implemented control system.', challenge='Create repeatable interfaces and package nested sections while balancing stability concepts with manufacturability.', process='Modelled the modular components, tuned mating clearances and checked physical fit and scale with printed assemblies.', result='A full-size prototype that exposed tolerance stack-up and assembly issues ahead of any advanced sensing or control development.', tags=['FUSION 360','ROCKET DESIGN','TOLERANCE STACK-UP','3D PRINTING']),
 dict(title='Automatic Rubbish Bin', short='Automatic Rubbish Bin', sector='ARDUINO / PRODUCT PROTOTYPING', image='automatic-bin.webp', alt='CAD model and physical electronics bench setup for touch-free automated rubbish bin', overview='I built a touch-free rubbish bin for my 3D-printing workspace using an Arduino, an IR proximity sensor, a display and an SG90 servo. Detection triggers the lid, which stays open for approximately two seconds before closing.', challenge='Make a reliable hands-free mechanism using simple electronics, while avoiding missed detections and unwanted triggers.', process='Integrated sensing, display and actuation using non-blocking timing; refined sensor placement, servo travel and enclosure access.', result='A compact practical prototype that applies embedded control to a real workspace problem: containing 3D-printing waste.', tags=['ARDUINO','IR SENSOR','SERVO','CONTROL LOGIC']),
 dict(title='Modular Electronics Control Board', short='Electronics Control Board', sector='ELECTRONICS / INTEGRATION', image='control-board.webp', alt='Photo of hand-assembled Arduino based electronics control board with drivers and wiring', overview='I designed and soldered a compact, modular board bringing together an Arduino Uno, two motor-driver modules, a 5 V buck converter and removable connections. It replaced a larger, loose wiring arrangement.', challenge='Distribute regulated power and route control signals cleanly while keeping higher-current motor drivers replaceable.', process='Planned electrical integration and connector access, soldered the board, and used continuity checks and multimeter testing to isolate faults.', result='A neater, serviceable control assembly with clearer cable management and easier troubleshooting during prototyping.', tags=['ARDUINO UNO','MOTOR DRIVERS','SOLDERING','POWER DISTRIBUTION']),
]
# Project image assets are prepared directly from the source PDF.
# retain all non-project files, original images and resume.

html=(ROOT/'projects.html').read_text(encoding='utf8')
soup=BeautifulSoup(html,'html.parser')
h1=soup.select_one('.projects-page-intro h1')
h1.clear(); h1.append(BeautifulSoup('Seven projects.<br><em>Seven stories.</em>','html.parser'))
intro_side=soup.select_one('.intro-side')
intro_side.select_one('p').string='A collection of real prototypes, CAD assemblies and experiments—from robotics and drivetrains to rapid manufacturing and embedded electronics.'
intro_side.select_one('span').string='Each project shows what I made, how I approached the engineering and what I learned from building it.'
new_link=BeautifulSoup('<a class="text-link portfolio-download" href="assets/Engineering-Project-Portfolio.pdf" target="_blank" rel="noopener noreferrer">View my original project portfolio ↗</a>', 'html.parser')
intro_side.append(new_link)
soup.select_one('.projects-page-intro .eyebrow').contents[-1].replace_with(' SELECTED ENGINEERING PROJECTS')
meta=soup.select_one('.projects-meta')
meta.select_one('span').string='01—07 / ENGINEERING PROJECT JOURNAL'
reel=soup.select_one('.projects-reel')
reel['aria-label']='Seven crossfading engineering project case studies'
container=soup.select_one('.project-crossfade')
container.clear()

def htext(value):
 import html
 return html.escape(value,quote=True)
for i,p in enumerate(projects,1):
 n=f'{i:02d}'
 markup=f'''<article class="project-panel" data-project="{i-1}" id="project-{n}" aria-label="Project {i}: {htext(p['title'])}">
   <div class="project-info">
     <div class="project-mini"><span>PROJECT {n} / 07</span><span>{htext(p['sector'])}</span></div>
     <h2>{htext(p['title'])}<span class="project-period">.</span></h2>
     <p class="project-desc">{htext(p['overview'])}</p>
     <div class="project-notes">
        <div><span>THE CHALLENGE</span><p>{htext(p['challenge'])}</p></div>
        <div><span>WHAT I DID</span><p>{htext(p['process'])}</p></div>
        <div><span>THE OUTCOME</span><p>{htext(p['result'])}</p></div>
     </div>
     <div class="project-tags">{''.join(f'<span>{htext(t)}</span>' for t in p['tags'])}</div>
   </div>
   <figure class="project-art-frame project-real-image">
     <img src="assets/{p['image']}" alt="{htext(p['alt'])}" loading="eager" decoding="async">
     <figcaption class="art-label">FIG. {n} — {htext(p['short']).upper()}</figcaption>
     <span class="art-cross" aria-hidden="true">+</span>
   </figure>
 </article>'''
 container.append(BeautifulSoup(markup,'html.parser'))
reel_counter=soup.select_one('.reel-counter')
reel_counter.select('span')[1].string='/ 07'
end=soup.select_one('.project-end-text')
end.select_one('p:not(.tiny-label)').string='Each project is part of how I learn: design in CAD, make a prototype, test what actually happens, then improve the next version.'
(ROOT/'projects.html').write_text(str(soup),encoding='utf8')

# update home: seven clickable rows, keep the original white homepage intact.
soup=BeautifulSoup((ROOT/'index.html').read_text(encoding='utf8'),'html.parser')
work=soup.select_one('.home-work')
for a in work.select('.work-row'): a.decompose()
listing=work.select_one('.work-list')
for i,p in enumerate(projects,1):
 n=f'{i:02d}'
 tags=p['sector'].replace(' / ', ' · ')
 row=BeautifulSoup(f'<a class="work-row reveal" href="projects.html#project-{n}"><span>{n}</span><strong>{htext(p['short'])}</strong><small>{htext(tags)}</small><b>↗</b></a>', 'html.parser')
 listing.append(row)
for anchor in work.find_all('a', href='projects.html'):
 anchor.string='Explore all seven projects ↗'
# Keep the original home section design and just update its project list.
(ROOT/'index.html').write_text(str(soup),encoding='utf8')

# Update the animation logic for seven positions; keep original structure and accessibility fallbacks.
js=(ROOT/'script.js').read_text(encoding='utf8')
js=js.replace('all five project panels','all seven project panels').replace('^#project-0[1-5]$', '^#project-0[1-7]$')
js=js.replace('if (location.hash && /^#project-0[1-7]$/.test(location.hash) && !mobile.matches)', 'if (location.hash && /^#project-0[1-7]$/.test(location.hash) && !mobile.matches)')
(ROOT/'script.js').write_text(js,encoding='utf8')
(ROOT/'script.js.txt').write_text(js,encoding='utf8')

css=(ROOT/'styles.css').read_text(encoding='utf8')
css=css.replace('/* five project scroll stories - normal flow without JavaScript */','/* seven project scroll stories - normal flow without JavaScript */')
css=css.replace('body.js .projects-reel{height:565vh;', 'body.js .projects-reel{height:790vh;')
css+='''
/* Portfolio 2026 — real project images within the original white theme. */
.projects-page-intro .portfolio-download{margin-top:20px;font-size:12px;gap:8px}
.project-info h2{font-size:clamp(39px,4.5vw,74px);line-height:1.06;margin:22px 0 18px;letter-spacing:-.067em;text-wrap:balance}
.project-period{color:var(--blue)}
.project-desc{font-size:14px;line-height:1.65;margin-bottom:18px;color:#56616b;max-width:630px}
.project-notes{padding-top:18px;gap:15px}
.project-notes span{font-size:9px;letter-spacing:.85px;margin-bottom:6px}
.project-notes p{font-size:11px;line-height:1.58;color:#65727d}
.project-tags{margin-top:19px}
.project-tags span{font-size:9px;padding:7px 9px}
.project-real-image{min-width:0;margin:0;background:#e8edf1;align-items:center;justify-content:center;overflow:hidden}
.project-real-image img{display:block;width:100%;height:100%;object-fit:contain;object-position:center;max-width:100%;max-height:100%;padding:22px;filter:contrast(1.015)}
.project-real-image .art-label{background:rgba(251,252,252,.9);color:#4777b9;max-width:calc(100% - 110px);padding:9px 11px;line-height:1.5;letter-spacing:.6px}
.project-real-image .art-cross{color:#567aa2}
/* Have enough room for detailed case studies on short laptop displays. */
@media (min-width:701px){.project-panel{min-height:0}.project-info{padding-top:22px;padding-bottom:22px}.project-info h2{font-size:clamp(33px,4.2vw,70px)}.project-real-image img{padding:12px}}
@media (max-width:1150px) and (min-width:701px){.project-notes{grid-template-columns:1fr 1fr;gap:9px}.project-notes>div:last-child{display:block}.project-info h2{font-size:clamp(32px,4.2vw,52px)}.project-desc{font-size:13px}.project-notes p{font-size:10px}.project-tags{margin-top:13px}}
@media (max-width:700px){.project-info h2{font-size:clamp(35px,9vw,60px)}.project-desc{font-size:14px;line-height:1.7}.project-notes{display:grid;grid-template-columns:1fr;gap:15px}.project-notes p{font-size:13px}.project-real-image{height:315px;min-height:315px}.project-real-image img{padding:10px}.project-real-image .art-label{bottom:12px;left:11px;max-width:85%;font-size:9px}}
@media (max-width:380px){.project-real-image{min-height:250px;height:250px}.project-info h2{font-size:35px}}
'''
(ROOT/'styles.css').write_text(css,encoding='utf8')
shutil.copy2('/mnt/data/Engineering Portfolio - Matthais Paterson Hawes(1).pdf',ASSETS/'Engineering-Project-Portfolio.pdf')
print('Built white portfolio with',len(projects),'projects and original PDF')
