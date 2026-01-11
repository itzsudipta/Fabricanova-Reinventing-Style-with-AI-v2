import svgwrite

def create_formal_shirt():
    # Canvas Setup
    WIDTH, HEIGHT = 600, 800
    dwg = svgwrite.Drawing("formal_shirt_sketch.svg", size=(WIDTH, HEIGHT))
    
    cx = WIDTH // 2
    ty = 100 # Top Y
    
    # Styles
    main_stroke = {"stroke": "black", "stroke_width": 2, "fill": "white"}
    detail_stroke = {"stroke": "#555", "stroke_width": 1, "fill": "none"}
    stitching = {"stroke": "#888", "stroke_width": 0.8, "fill": "none", "stroke_dasharray": "2,2"}

    # ---- 1. COLLAR & NECKLINE ----
    # The collar is the most important part of a formal shirt
    collar = dwg.path(d=f"M {cx-40} {ty+20}", **main_stroke)
    collar.push(f"L {cx-60} {ty+50} L {cx} {ty+70} L {cx+60} {ty+50} L {cx+40} {ty+20}")
    collar.push(f"Q {cx} {ty+10}, {cx-40} {ty+20}") # Back neck curve
    dwg.add(collar)
    
    # Collar Stand (Inner line)
    dwg.add(dwg.path(d=f"M {cx-35} {ty+25} Q {cx} {ty+35}, {cx+35} {ty+25}", **detail_stroke))

    # ---- 2. BODY OUTLINE (Slim Fit) ----
    # Points for a tailored look
    sh_l, sh_r = (cx-110, ty+40), (cx+110, ty+40) # Shoulders
    wst_l, wst_r = (cx-85, ty+250), (cx+85, ty+250) # Tapered waist
    hem_l, hem_r = (cx-100, ty+450), (cx+100, ty+450) # Hip flare
    
    body = dwg.path(d=f"M {cx-40} {ty+20}", **main_stroke)
    body.push(f"L {sh_l[0]} {sh_l[1]}") # Shoulder slope
    body.push(f"L {cx-100} {ty+140}")    # Armhole start
    body.push(f"Q {wst_l[0]} {wst_l[1]}, {hem_l[0]} {hem_l[1]}") # Side seam curve
    body.push(f"Q {cx} {ty+480}, {hem_r[0]} {hem_r[1]}") # Curved shirttail hem
    body.push(f"Q {wst_r[0]} {wst_r[1]}, {cx+100} {ty+140}") # Side seam curve
    body.push(f"L {sh_r[0]} {sh_r[1]}")
    body.push(f"L {cx+40} {ty+20} Z")
    dwg.add(body)

    # ---- 3. BUTTON PLACKET ----
    # The center strip where buttons sit
    dwg.add(dwg.rect(insert=(cx-12, ty+70), size=(24, 405), **main_stroke))
    
    # Buttons
    for i in range(6):
        dwg.add(dwg.circle(center=(cx, ty + 110 + (i * 60)), r=3, fill="white", stroke="black"))

    # ---- 4. SLEEVES & CUFFS ----
    for side in [-1, 1]:
        start_x = cx + (side * 110)
        sleeve = dwg.path(d=f"M {start_x} {ty+40}", **main_stroke)
        sleeve.push(f"L {start_x + (side * 30)} {ty+400}") # Outer arm
        sleeve.push(f"L {start_x - (side * 10)} {ty+400}") # Cuff bottom
        sleeve.push(f"L {cx + (side * 100)} {ty+140}")    # Underarm
        dwg.add(sleeve)
        
        # Cuff Detail
        dwg.add(dwg.rect(insert=(start_x + (side * 25) - (20 if side==1 else 0), ty+370), 
                         size=(40, 30), **main_stroke))

    # ---- 5. TAILORING DETAILS (Yoke & Pocket) ----
    # Shoulder Yoke
    dwg.add(dwg.path(d=f"M {cx-110} {ty+80} Q {cx} {ty+95}, {cx+110} {ty+80}", **stitching))
    
    # Chest Pocket (Left side)
    pocket = dwg.path(d=f"M {cx-75} {ty+130} L {cx-35} {ty+130} L {cx-35} {ty+180} L {cx-55} {ty+195} L {cx-75} {ty+180} Z", 
                      **detail_stroke)
    dwg.add(pocket)

    dwg.save()
    print("✅ Formal Shirt Sketch generated: formal_shirt_sketch.svg")

create_formal_shirt()