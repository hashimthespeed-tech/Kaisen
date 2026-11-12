"""Build and render the animated MOMENT research folio.

Run: blender -b --python scripts/build-research-folio.py
The source scene, preview renders, and web GLB are all generated from this file.
"""

import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "artwork" / "research-folio"
TEX = ART / "textures"
PREVIEW = ROOT / "previews" / "research-3d"
PREVIEW.mkdir(parents=True, exist_ok=True)
PUBLIC = ROOT / "public"

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)


def material(name, color, metallic=0, roughness=0.5):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    return mat


def textured_material(name, filename):
    mat = material(name, (1, 1, 1), roughness=0.61)
    image = bpy.data.images.load(str(TEX / filename), check_existing=True)
    image.pack()
    tex = mat.node_tree.nodes.new("ShaderNodeTexImage")
    tex.image = image
    mat.node_tree.links.new(tex.outputs["Color"], mat.node_tree.nodes.get("Principled BSDF").inputs["Base Color"])
    return mat


navy = material("Midnight blue leather", (0.015, 0.034, 0.070), roughness=0.41)
navy.node_tree.nodes.get("Principled BSDF").inputs["Coat Weight"].default_value = 0.18
navy.node_tree.nodes.get("Principled BSDF").inputs["Coat Roughness"].default_value = 0.3
grain = navy.node_tree.nodes.new("ShaderNodeTexNoise")
grain.inputs["Scale"].default_value = 340
grain.inputs["Detail"].default_value = 2
bump = navy.node_tree.nodes.new("ShaderNodeBump")
bump.inputs["Strength"].default_value = 0.12
bump.inputs["Distance"].default_value = 0.008
navy.node_tree.links.new(grain.outputs["Fac"], bump.inputs["Height"])
navy.node_tree.links.new(bump.outputs["Normal"], navy.node_tree.nodes.get("Principled BSDF").inputs["Normal"])
paper_edge = material("Warm paper edges", (0.83, 0.85, 0.86), roughness=0.86)
silver = material("Satin nickel", (0.59, 0.66, 0.73), metallic=0.83, roughness=0.25)
gold = material("Warm silver foil", (0.71, 0.70, 0.65), metallic=0.72, roughness=0.28)
desk = material("Pale stone studio", (0.66, 0.70, 0.75), roughness=0.8)
cover_art = textured_material("Cover graphic", "cover.png")
overview_art = textured_material("Overview page", "overview.png")
earnings_art = textured_material("Earnings page", "earnings.png")
products_art = textured_material("Products page", "products.png")
industry_art = textured_material("Industry page", "industry.png")


def box(name, location, scale, mat, bevel=0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    if bevel:
        mod = obj.modifiers.new("Soft machined edges", "BEVEL")
        mod.width = bevel
        mod.segments = 3
        mod.affect = "EDGES"
        obj.modifiers.new("Weighted surface normals", "WEIGHTED_NORMAL")
    return obj


def curve(name, points, radius, mat, parent=None):
    data = bpy.data.curves.new(name, "CURVE")
    data.dimensions = "3D"
    data.bevel_depth = radius
    data.bevel_resolution = 3
    spline = data.splines.new("POLY")
    spline.points.add(len(points)-1)
    for p, xyz in zip(spline.points, points):
        p.co = (xyz[0], xyz[1], xyz[2] - (parent.location.z if parent else 0), 1)
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    if parent:
        obj.parent = parent
    return obj


def page_mesh(name, right_material, back_material, z, parent=None, x0=0.10, x1=3.16, thickness=0.018):
    """A thin UV mapped leaf, with a separate image on each side."""
    y0, y1 = -1.89, 1.89
    local_z = z - (parent.location.z if parent else 0)
    verts = [(x0,y0,local_z),(x1,y0,local_z),(x1,y1,local_z),(x0,y1,local_z),
             (x0,y0,local_z-thickness),(x1,y0,local_z-thickness),(x1,y1,local_z-thickness),(x0,y1,local_z-thickness)]
    faces = [(0,1,2,3),(7,6,5,4),(0,4,5,1),(1,5,6,2),(2,6,7,3),(3,7,4,0)]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    for mat in (right_material, back_material, paper_edge):
        mesh.materials.append(mat)
    mesh.polygons[1].material_index = 1
    for poly in list(mesh.polygons)[2:]:
        poly.material_index = 2
    uv = mesh.uv_layers.new(name="Page print")
    for poly in mesh.polygons:
        for loop_index in poly.loop_indices:
            vertex = mesh.vertices[mesh.loops[loop_index].vertex_index].co
            u = (vertex.x-x0)/(x1-x0)
            v = (vertex.y-y0)/(y1-y0)
            if poly.index == 1:
                u = 1-u
            uv.data[loop_index].uv = (u,v)
    if parent:
        obj.parent = parent
    return obj


# A real bound object: leather boards, paper block, metal spine, and stitch rows.
base = box("Right leather board", (1.66,0,0.18), (3.31,4.02,0.14), navy, 0.058)
box("Right board inset", (1.65,0,0.258), (3.10,3.82,0.018), silver, 0.011)
box("Paper block below research", (1.63,0,0.31), (3.04,3.72,0.105), paper_edge, 0.018)
page_mesh("Industry research leaf", industry_art, paper_edge, 0.378)
page_mesh("Product research leaf", products_art, paper_edge, 0.396)
page_mesh("Visible earnings leaf", earnings_art, paper_edge, 0.416)

spine = box("Bound leather spine", (0,0,0.22), (0.25,4.04,0.25), navy, 0.10)
for y in (-1.34, 0, 1.34):
    bpy.ops.mesh.primitive_torus_add(major_segments=48, minor_segments=10,
                                    location=(0,y,0.385), rotation=(0, math.pi/2, 0),
                                    major_radius=0.116, minor_radius=0.025)
    ring = bpy.context.object
    ring.name = "Satin binder ring"
    ring.data.materials.append(silver)

hinge = bpy.data.objects.new("Opening cover hinge", None)
bpy.context.collection.objects.link(hinge)
hinge.location = (0,0,0.5)
box_leaf = box("Turning leather board", (1.66,0,-0.01), (3.31,4.02,0.11), navy, 0.047)
box_leaf.parent = hinge
page_mesh("Cover outside and research inside", cover_art, overview_art, 0.553, hinge, 0.14, 3.16, 0.14)
for y in (-1.95, 1.95):
    curve("Fine edge stitch", [(0.20,y,0.556),(3.05,y,0.556)], 0.004, gold, hinge)
for x in (0.19, 3.08):
    curve("Fine edge stitch", [(x,-1.92,0.556),(x,1.92,0.556)], 0.004, gold, hinge)

for frame, angle in ((1,0), (13,-0.08), (35,-0.78), (61,-2.48), (80,-math.pi), (100,-math.pi)):
    hinge.rotation_euler[1] = angle
    hinge.keyframe_insert(data_path="rotation_euler", frame=frame)
for fcurve in hinge.animation_data.action.fcurves:
    for key in fcurve.keyframe_points:
        key.interpolation = "BEZIER"
        key.handle_left_type = "AUTO_CLAMPED"
        key.handle_right_type = "AUTO_CLAMPED"

# Clean studio floor is part of the render source, excluded from the GLB so the
# web scene can place the same model over the site's own independent stage.
floor = box("Render-only stone floor", (0,0,-0.105), (200,200,0.1), desk, 0)

world = bpy.context.scene.world
world.color = (0.36,0.43,0.55)
world.use_nodes = True
world.node_tree.nodes.get("Background").inputs["Color"].default_value = (0.38,0.47,0.6,1)
world.node_tree.nodes.get("Background").inputs["Strength"].default_value = 0.65

def area(name, loc, power, size, color):
    data = bpy.data.lights.new(name, "AREA")
    data.energy = power
    data.shape = "DISK"
    data.size = size
    data.color = color
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    direction = Vector((0,0,0)) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z","Y").to_euler()

area("Large softbox", (-3,-4,7), 1200, 6.0, (0.88,0.93,1))
area("Warm edge light", (4,3,5), 900, 4.0, (1,0.91,0.78))
area("Side bounce", (-5,2,3), 650, 5.0, (0.79,0.87,1))

camera_data = bpy.data.cameras.new("Editorial camera")
camera = bpy.data.objects.new("Editorial camera", camera_data)
bpy.context.collection.objects.link(camera)
camera.location = (1.4,-7.1,6.1)
target = Vector((0,0,0.08))
camera.rotation_euler = (target-camera.location).to_track_quat("-Z","Y").to_euler()
camera_data.type = "ORTHO"
camera_data.ortho_scale = 8.7
bpy.context.scene.camera = camera

scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.samples = 24
scene.cycles.use_denoising = False
scene.render.resolution_x = 1600
scene.render.resolution_y = 1050
scene.render.resolution_percentage = 100
scene.view_settings.view_transform = "AgX"
scene.render.image_settings.file_format = "PNG"
scene.frame_start = 1
scene.frame_end = 100
scene.render.film_transparent = False

# Export only the asset, with its texture and animation baked into one file.
floor.hide_render = True
for obj in bpy.context.scene.objects:
    obj.select_set(obj not in (floor,camera) and obj.type not in ("LIGHT",))
bpy.context.view_layer.objects.active = base
bpy.ops.export_scene.gltf(filepath=str(PUBLIC / "moment-research-folio.glb"), export_format="GLB",
                          use_selection=True, export_animations=True, export_materials="EXPORT")
floor.hide_render = False
bpy.ops.wm.save_as_mainfile(filepath=str(ART / "research-folio.blend"))

if "--no-render" in sys.argv:
    print("Exported without preview renders")
    sys.exit(0)

for frame, filename in ((1,"01-closed.png"),(44,"02-turning.png"),(80,"03-open.png")):
    scene.frame_set(frame)
    scene.render.filepath = str(PREVIEW / filename)
    bpy.ops.render.render(write_still=True)
    print("Wrote", scene.render.filepath)
print("Wrote", PUBLIC / "moment-research-folio.glb")
