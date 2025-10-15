# generate_assets_v2.py
# Based Streaks — FLAME-POWERED Asset Generator
# Requires: Pillow (PIL)

from PIL import Image, ImageDraw, ImageFont
import os, math, zipfile

# ----------------------
# BRAND COLORS - FLAME EDITION
# ----------------------
BASE_BLUE = (0, 82, 255)
FIRE_ORANGE = (255, 107, 53)
FIRE_YELLOW = (255, 184, 0)
FIRE_LIGHT = (255, 220, 100)
SUCCESS_GREEN = (0, 211, 149)
WHITE = (255, 255, 255)
BLACK = (7, 10, 14)
BG = (12, 16, 26)
CARD_BG = (18, 22, 34)

DIST = os.path.join(os.path.dirname(__file__), "dist")
ICON_DIR = os.path.join(DIST, "flame_icons")
os.makedirs(DIST, exist_ok=True)
os.makedirs(ICON_DIR, exist_ok=True)

# ----------------------
# Helpers
# ----------------------
def load_font(size):
    candidates = [
        "/System/Library/Fonts/Helvetica.ttc",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    ]
    for p in candidates:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size=size)
            except:
                pass
    return ImageFont.load_default()

def add_radial_glow(img, center=None, color=FIRE_ORANGE, radius=400, intensity=0.3):
    """Circular gradient glow effect"""
    if center is None:
        center = (img.width//2, img.height//2)
    layer = Image.new("RGBA", img.size, (0,0,0,0))
    d = ImageDraw.Draw(layer)
    
    for r in range(radius, 0, -10):
        alpha = int(intensity * 255 * (r/radius))
        d.ellipse([
            center[0]-r, center[1]-r,
            center[0]+r, center[1]+r
        ], fill=(*color, alpha))
    
    img.alpha_composite(layer)

def add_animated_lines(img, density=30, color=(255,255,255,15)):
    """Subtle animated-look diagonal lines"""
    layer = Image.new("RGBA", img.size, (0,0,0,0))
    d = ImageDraw.Draw(layer)
    
    for i in range(0, img.width + img.height, density):
        d.line([(i, 0), (0, i)], fill=color, width=2)
    
    img.alpha_composite(layer)

def rounded_rect(draw, xy, radius, fill):
    draw.rounded_rectangle(xy, radius=radius, fill=fill)

def gradient_fill(img, box, colors, direction="vertical"):
    """Create gradient between multiple colors"""
    x0, y0, x1, y1 = box
    w, h = x1-x0, y1-y0
    gradient = Image.new("RGBA", (w, h))
    draw = ImageDraw.Draw(gradient)
    
    steps = h if direction == "vertical" else w
    num_colors = len(colors)
    
    for i in range(steps):
        progress = i / steps
        segment = progress * (num_colors - 1)
        idx = int(segment)
        
        if idx >= num_colors - 1:
            color = colors[-1]
        else:
            local_progress = segment - idx
            c1, c2 = colors[idx], colors[idx + 1]
            color = tuple(
                int(c1[j] + (c2[j] - c1[j]) * local_progress)
                for j in range(3)
            )
        
        if direction == "vertical":
            draw.line([(0, i), (w, i)], fill=color)
        else:
            draw.line([(i, 0), (i, h)], fill=color)
    
    img.paste(gradient, (x0, y0), gradient)

# ----------------------
# FLAME ICON PATTERNS (16x16 grid)
# ----------------------

# 🌱 Seed - Baby flame
seed_pattern = [
    (7,12), (8,12),
    (6,11), (7,11), (8,11), (9,11),
    (7,10), (8,10),
    (7,9)
]

# 🔥 Flame - Growing fire (7 days)
flame_pattern = [
    (7,7), (8,7),
    (6,8), (7,8), (8,8), (9,8),
    (5,9), (6,9), (7,9), (8,9), (9,9), (10,9),
    (6,10), (7,10), (8,10), (9,10),
    (7,11), (8,11),
    (7,12)
]

# 💎 Diamond - Base + Fire (14 days)
diamond_pattern = [
    (7,5), (8,5),
    (6,6), (7,6), (8,6), (9,6),
    (5,7), (6,7), (7,7), (8,7), (9,7), (10,7),
    (5,8), (6,8), (7,8), (8,8), (9,8), (10,8),
    (6,9), (7,9), (8,9), (9,9),
    (7,10), (8,10),
    (7,11)
]

# 🐝 Bee - Hexagon flame (21 days)
bee_pattern = [
    (7,4), (8,4),
    (6,5), (7,5), (8,5), (9,5),
    (5,6), (6,6), (7,6), (8,6), (9,6), (10,6),
    (5,7), (6,7), (9,7), (10,7),
    (5,8), (6,8), (9,8), (10,8),
    (6,9), (7,9), (8,9), (9,9),
    (7,10), (8,10)
]

# 👑 Crown - King of streaks (30 days)
crown_pattern = [
    (4,7), (6,7), (8,7), (10,7), (12,7),
    (4,8), (5,8), (6,8), (7,8), (8,8), (9,8), (10,8), (11,8), (12,8),
    (5,9), (6,9), (7,9), (8,9), (9,9), (10,9), (11,9),
    (6,10), (7,10), (8,10), (9,10), (10,10),
    (7,11), (8,11), (9,11)
]

# ----------------------
# Generate Flame Icons
# ----------------------
def generate_flame_icon(size, pattern, use_gradient=True, bg_color=None):
    """Generate a flame-style pixel icon with gradient"""
    img = Image.new("RGBA", (size, size), bg_color or (0,0,0,0))
    d = ImageDraw.Draw(img)
    cell = size // 16
    
    # Calculate flame colors based on height
    max_y = max(gy for gx, gy in pattern)
    min_y = min(gy for gx, gy in pattern)
    
    for (gx, gy) in pattern:
        x0, y0 = gx * cell, gy * cell
        x1, y1 = x0 + cell, y0 + cell
        
        if use_gradient:
            # Gradient from yellow (top) to orange (bottom)
            progress = (gy - min_y) / (max_y - min_y) if max_y != min_y else 0
            color = tuple(
                int(FIRE_YELLOW[i] + (FIRE_ORANGE[i] - FIRE_YELLOW[i]) * progress)
                for i in range(3)
            )
        else:
            color = FIRE_ORANGE
        
        d.rectangle([x0, y0, x1, y1], fill=color)
    
    return img

def generate_all_flame_icons():
    """Generate all badge icons"""
    icons = {}
    patterns = {
        "seed": (seed_pattern, False),
        "flame": (flame_pattern, True),
        "diamond": (diamond_pattern, True),
        "bee": (bee_pattern, True),
        "crown": (crown_pattern, True)
    }
    
    for name, (pat, gradient) in patterns.items():
        img = generate_flame_icon(256, pat, use_gradient=gradient)
        out = os.path.join(ICON_DIR, f"{name}.png")
        img.save(out)
        icons[name] = img
    
    return icons

# ----------------------
# Splash Screen - FLAME HERO
# ----------------------
def generate_splash():
    splash = Image.new("RGBA", (1200, 630), BLACK)
    
    # Radial glow from center
    add_radial_glow(splash, center=(600, 315), color=FIRE_ORANGE, radius=500, intensity=0.4)
    add_radial_glow(splash, center=(600, 315), color=BASE_BLUE, radius=300, intensity=0.2)
    
    # Diagonal lines for texture
    add_animated_lines(splash, density=40)
    
    d = ImageDraw.Draw(splash)
    
    # Big flame icon in center
    flame_big = generate_flame_icon(300, flame_pattern, use_gradient=True)
    splash.paste(flame_big, (150, 180), flame_big)
    
    # Text
    title_font = load_font(110)
    sub_font = load_font(42)
    
    d.text((500, 180), "Based", font=title_font, fill=WHITE)
    d.text((500, 300), "Streaks", font=title_font, fill=FIRE_ORANGE)
    d.text((500, 430), "Keep the flame alive 🔥", font=sub_font, fill=(200, 210, 230))
    
    out = os.path.join(DIST, "splash.png")
    splash.save(out)
    return out

# ----------------------
# Screenshot 1 - HOME (LIVING FLAME)
# ----------------------
def generate_home_screen(icons):
    ss = Image.new("RGBA", (1080, 1920), BG)
    
    # Glow from top
    add_radial_glow(ss, center=(540, 600), color=FIRE_ORANGE, radius=600, intensity=0.15)
    
    d = ImageDraw.Draw(ss)
    
    # Top bar
    d.rectangle([0, 0, 1080, 140], fill=BLACK)
    big_font = load_font(52)
    d.text((60, 50), "Based Streaks 🔥", font=big_font, fill=WHITE)
    
    # HERO FLAME CARD
    card_box = [60, 200, 1020, 900]
    rounded_rect(d, card_box, 32, CARD_BG)
    
    # Gradient overlay on top of card
    gradient_fill(ss, [card_box[0], card_box[1], card_box[2], card_box[1]+300], 
                  [FIRE_ORANGE + (40,), CARD_BG + (0,)], "vertical")
    
    # Giant flame icon
    giant_flame = icons["flame"].resize((320, 320), Image.NEAREST)
    ss.paste(giant_flame, (380, 260), giant_flame)
    
    # Streak number over flame
    mega_font = load_font(140)
    d.text((450, 420), "12", font=mega_font, fill=WHITE)
    
    # Subtitle
    body_font = load_font(44)
    d.text((card_box[0]+60, 620), "Current Streak", font=body_font, fill=(180, 190, 210))
    d.text((card_box[0]+60, 680), "Max: 12  •  Total XP: 130", font=load_font(38), fill=(140, 150, 170))
    
    # Circular progress (simplified as text for now)
    d.text((card_box[0]+60, 750), "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ 12/30", font=load_font(36), fill=BASE_BLUE)
    
    # CTA Button
    btn_box = [card_box[0]+60, 820, card_box[2]-60, 880]
    gradient_fill(ss, btn_box, [FIRE_ORANGE, FIRE_YELLOW], "horizontal")
    d.rounded_rectangle(btn_box, radius=24, outline=FIRE_YELLOW, width=3)
    d.text((btn_box[0]+220, btn_box[1]+8), "Check & Claim", font=big_font, fill=WHITE)
    
    # Info section
    info_y = 950
    small_font = load_font(38)
    d.text((80, info_y), "Today's mission: Post #gmBase on Farcaster", font=small_font, fill=(160, 170, 190))
    
    # Rewards cards
    rewards_y = 1050
    for title, emoji, desc in [
        ("Season Rewards", "🏆", "7d🌱 14d🔥 21d💎 30d👑"),
        ("Referral Bonus", "💰", "Friend streaks 3 days → You earn $15")
    ]:
        box = [60, rewards_y, 1020, rewards_y + 180]
        rounded_rect(d, box, 24, CARD_BG)
        d.text((100, rewards_y + 30), f"{emoji} {title}", font=load_font(46), fill=WHITE)
        d.text((100, rewards_y + 100), desc, font=load_font(36), fill=(180, 190, 210))
        rewards_y += 220
    
    out = os.path.join(DIST, "screenshot-1.png")
    ss.save(out)
    return out

# ----------------------
# Screenshot 2 - LEADERBOARD
# ----------------------
def generate_leaderboard(icons):
    ss = Image.new("RGBA", (1080, 1920), BG)
    d = ImageDraw.Draw(ss)
    
    # Top bar
    d.rectangle([0, 0, 1080, 140], fill=BLACK)
    d.text((60, 50), "🏆 Leaderboard", font=load_font(52), fill=WHITE)
    d.text((800, 50), "S1 • Day 12", font=load_font(38), fill=(180, 190, 210))
    
    # Header
    d.text((80, 180), "Rank", font=load_font(40), fill=(160, 170, 190))
    d.text((280, 180), "User", font=load_font(40), fill=(160, 170, 190))
    d.text((850, 180), "XP", font=load_font(40), fill=(160, 170, 190))
    
    # Leaderboard rows
    row_y = 260
    users = [
        ("0xbee.eth", 520, "crown", 1),
        ("han.base", 500, "diamond", 2),
        ("basedguy", 485, "bee", 3),
        ("bluebuild", 470, "flame", 4),
        ("seedling", 450, "seed", 5)
    ]
    
    for name, xp, icon_name, rank in users:
        box = [60, row_y, 1020, row_y + 140]
        rounded_rect(d, box, 24, CARD_BG)
        
        # Rank badge
        if rank == 1:
            badge_color = (255, 215, 0)  # Gold
        elif rank == 2:
            badge_color = (192, 192, 192)  # Silver
        elif rank == 3:
            badge_color = (205, 127, 50)  # Bronze
        else:
            badge_color = (50, 60, 80)
        
        d.ellipse([100, row_y+30, 180, row_y+110], fill=badge_color)
        d.text((125, row_y+48), str(rank), font=load_font(44), fill=BLACK if rank <= 3 else WHITE)
        
        # User icon
        user_icon = icons[icon_name].resize((70, 70), Image.NEAREST)
        ss.paste(user_icon, (210, row_y+35), user_icon)
        
        # Name
        d.text((300, row_y+50), name, font=load_font(46), fill=WHITE)
        
        # XP badge
        xp_box = [780, row_y+40, 960, row_y+100]
        rounded_rect(d, xp_box, 20, FIRE_ORANGE)
        d.text((800, row_y+48), f"{xp} XP", font=load_font(40), fill=WHITE)
        
        row_y += 170
    
    # Footer info
    d.text((80, row_y + 60), "Top 3 win USDC/BASE rewards 💰", font=load_font(40), fill=(180, 190, 210))
    
    out = os.path.join(DIST, "screenshot-2.png")
    ss.save(out)
    return out

# ----------------------
# App Icon (1024x1024)
# ----------------------
def generate_app_icon(icons):
    icon = Image.new("RGBA", (1024, 1024), BLACK)
    
    # Radial glow background
    add_radial_glow(icon, color=FIRE_ORANGE, radius=600, intensity=0.5)
    add_radial_glow(icon, color=BASE_BLUE, radius=400, intensity=0.3)
    
    # Giant flame in center
    giant = icons["flame"].resize((600, 600), Image.NEAREST)
    icon.paste(giant, (212, 212), giant)
    
    out = os.path.join(DIST, "icon.png")
    icon.save(out)
    return out

# ----------------------
# Main
# ----------------------
def main():
    print("🔥 GENERATING FLAME-POWERED ASSETS...")
    
    # 1. Generate flame icons
    print("📦 Creating flame icons...")
    icons = generate_all_flame_icons()
    
    # 2. Splash
    print("💥 Generating splash screen...")
    splash = generate_splash()
    
    # 3. Screenshots
    print("📱 Creating app screenshots...")
    home = generate_home_screen(icons)
    lb = generate_leaderboard(icons)
    
    # 4. App icon
    print("🎨 Building app icon...")
    app_icon = generate_app_icon(icons)
    
    # 5. Zip everything
    print("📦 Packaging assets...")
    zip_path = os.path.join(DIST, "based_streaks_assets.zip")
    with zipfile.ZipFile(zip_path, 'w') as zipf:
        for fname in ["splash.png", "screenshot-1.png", "screenshot-2.png", "icon.png"]:
            zipf.write(os.path.join(DIST, fname), fname)
        for icon_file in os.listdir(ICON_DIR):
            zipf.write(os.path.join(ICON_DIR, icon_file), f"flame_icons/{icon_file}")
    
    print("\n✅ DONE!")
    print(f"📁 Output: {DIST}")
    print(f"📦 ZIP: {zip_path}")
    print("\n🔥 FLAME-POWERED ASSETS READY! LET'S GOOO!")

if __name__ == "__main__":
    main()