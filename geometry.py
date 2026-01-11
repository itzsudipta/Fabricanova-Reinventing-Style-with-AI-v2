import json

# Load design JSON
with open("design.json") as f:
    design = json.load(f)

# Canvas
CANVAS_WIDTH = 300
CANVAS_HEIGHT = 500
CENTER_X = CANVAS_WIDTH // 2
TOP_Y = 60

# ---- Attribute → Geometry Mappings ---- #

LENGTH_MAP = {
    "short": 260,
    "knee": 340,
    "long": 420
}

FIT_MAP = {
    "regular": 70,
    "relaxed": 90
}

SILHOUETTE_EXTRA_WIDTH = {
    "straight": 0,
    "A-line": 60
}

SLEEVE_MAP = {
    "sleeveless": 0,
    "short": 30,
    "3/4": 55,
    "long": 80
}

NECK_MAP = {
    "round": {"radius": 12},
    "v": {"depth": 20},
    "square": {"width": 24}
}

# ---- Compute Geometry ---- #

body_height = LENGTH_MAP[design["length"]]
top_width = FIT_MAP[design["fit"]]
bottom_width = top_width + SILHOUETTE_EXTRA_WIDTH[design["silhouette"]]
sleeve_length = SLEEVE_MAP[design["sleeve"]]
neck_params = NECK_MAP[design["neckline"]]

# ---- Final Geometry Object ---- #

geometry = {
    "canvas_width": CANVAS_WIDTH,
    "canvas_height": CANVAS_HEIGHT,
    "center_x": CENTER_X,
    "top_y": TOP_Y,
    "body_height": body_height,
    "top_width": top_width,
    "bottom_width": bottom_width,
    "sleeve_length": sleeve_length,
    "neck": neck_params
}

print("Geometry values:", geometry)
