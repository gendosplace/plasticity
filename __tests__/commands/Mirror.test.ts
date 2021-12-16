import * as THREE from "three";
import { ThreePointBoxFactory } from "../../src/commands/box/BoxFactory";
import LineFactory from "../../src/commands/line/LineFactory";
import { MirrorFactory, MirrorOrSymmetryFactory, SymmetryFactory } from "../../src/commands/mirror/MirrorFactory";
import SphereFactory from "../../src/commands/sphere/SphereFactory";
import { EditorSignals } from '../../src/editor/EditorSignals';
import { GeometryDatabase } from '../../src/editor/GeometryDatabase';
import MaterialDatabase from '../../src/editor/MaterialDatabase';
import * as visual from '../../src/visual_model/VisualModel';
import { FakeMaterials } from "../../__mocks__/FakeMaterials";
import '../matchers';

let db: GeometryDatabase;
let materials: Required<MaterialDatabase>;
let signals: EditorSignals;

beforeEach(() => {
    materials = new FakeMaterials();
    signals = new EditorSignals();
    db = new GeometryDatabase(materials, signals);
})

describe(MirrorFactory, () => {
    let mirror: MirrorFactory;

    beforeEach(() => {
        mirror = new MirrorFactory(db, materials, signals);
    })

    test('curves', async () => {
        const makeLine = new LineFactory(db, materials, signals);
        makeLine.p1 = new THREE.Vector3();
        makeLine.p2 = new THREE.Vector3(1, 1, 0);
        const line = await makeLine.commit() as visual.SpaceInstance<visual.Curve3D>;
        mirror.origin = new THREE.Vector3();
        mirror.item = line;
        mirror.normal = new THREE.Vector3(0, 1, 0);

        const item = await mirror.commit() as visual.SpaceInstance<visual.Curve3D>;
        const bbox = new THREE.Box3().setFromObject(item);
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        expect(center).toApproximatelyEqual(new THREE.Vector3(0.5, -0.5, 0));
        expect(bbox.min).toApproximatelyEqual(new THREE.Vector3(0, -1, 0));
        expect(bbox.max).toApproximatelyEqual(new THREE.Vector3(1, 0, 0));
    })

    test('solids', async () => {
        const makeBox = new ThreePointBoxFactory(db, materials, signals);
        makeBox.p1 = new THREE.Vector3();
        makeBox.p2 = new THREE.Vector3(1, 0, 0);
        makeBox.p3 = new THREE.Vector3(1, 1, 0);
        makeBox.p4 = new THREE.Vector3(1, 1, 1);
        const box = await makeBox.commit() as visual.Solid;

        const bbox = new THREE.Box3().setFromObject(box);
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        expect(center).toApproximatelyEqual(new THREE.Vector3(0.5, 0.5, 0.5));
        expect(bbox.min).toApproximatelyEqual(new THREE.Vector3(0, 0, 0));
        expect(bbox.max).toApproximatelyEqual(new THREE.Vector3(1, 1, 1));

        mirror.origin = new THREE.Vector3();
        mirror.item = box;
        mirror.normal = new THREE.Vector3(0, 1, 0);

        const item = await mirror.commit() as visual.SpaceInstance<visual.Curve3D>;
        bbox.setFromObject(item);
        bbox.getCenter(center);
        expect(center).toApproximatelyEqual(new THREE.Vector3(0.5, -0.5, 0.5));
        expect(bbox.min).toApproximatelyEqual(new THREE.Vector3(0, -1, 0));
        expect(bbox.max).toApproximatelyEqual(new THREE.Vector3(1, 0, 1));
    })
})

const X = new THREE.Vector3(1, 0, 0);
const Z = new THREE.Vector3(0, 0, 1);

describe(SymmetryFactory, () => {
    let symmetry: SymmetryFactory;
    let sphere: visual.Solid;

    beforeEach(async () => {
        symmetry = new SymmetryFactory(db, materials, signals);
        const makeSphere = new SphereFactory(db, materials, signals);
        makeSphere.center = new THREE.Vector3(0.5, 0, 0);
        makeSphere.radius = 1;
        sphere = await makeSphere.commit() as visual.Solid;
    })

    test('commit', async () => {
        symmetry.solid = sphere;
        symmetry.origin = new THREE.Vector3();
        symmetry.quaternion = new THREE.Quaternion().setFromUnitVectors(Z, X);

        const item = await symmetry.commit() as visual.SpaceInstance<visual.Curve3D>;
        const bbox = new THREE.Box3().setFromObject(item);
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        expect(center).toApproximatelyEqual(new THREE.Vector3(0, 0, 0));
        expect(bbox.min).toApproximatelyEqual(new THREE.Vector3(-1.5, -1, -1));
        expect(bbox.max).toApproximatelyEqual(new THREE.Vector3(1.5, 1, 1));

        expect(db.visibleObjects.length).toBe(1);
    });

    test('update', async () => {
        symmetry.solid = sphere;
        symmetry.origin = new THREE.Vector3();
        symmetry.quaternion = new THREE.Quaternion().setFromUnitVectors(Z, X);

        await symmetry.update();
        expect(db.temporaryObjects.children.length).toBe(1);

        const item = db.temporaryObjects.children[0];

        const bbox = new THREE.Box3().setFromObject(item);
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        expect(center).toApproximatelyEqual(new THREE.Vector3(0, 0, 0));
        expect(bbox.min).toApproximatelyEqual(new THREE.Vector3(-1.5, -1, -1));
        expect(bbox.max).toApproximatelyEqual(new THREE.Vector3(1.5, 1, 1));

        expect(db.visibleObjects.length).toBe(1);
    });
});

describe(MirrorOrSymmetryFactory, () => {
    let mirror: MirrorOrSymmetryFactory;

    beforeEach(() => {
        mirror = new MirrorOrSymmetryFactory(db, materials, signals);
    })

    let box: visual.Solid;
    const bbox = new THREE.Box3();
    const center = new THREE.Vector3();

    beforeEach(async () => {
        const makeBox = new ThreePointBoxFactory(db, materials, signals);
        makeBox.p1 = new THREE.Vector3();
        makeBox.p2 = new THREE.Vector3(1, 0, 0);
        makeBox.p3 = new THREE.Vector3(1, 1, 0);
        makeBox.p4 = new THREE.Vector3(1, 1, 1);
        box = await makeBox.commit() as visual.Solid;

        bbox.setFromObject(box);
        bbox.getCenter(center);
        expect(center).toApproximatelyEqual(new THREE.Vector3(0.5, 0.5, 0.5));
        expect(bbox.min).toApproximatelyEqual(new THREE.Vector3(0, 0, 0));
        expect(bbox.max).toApproximatelyEqual(new THREE.Vector3(1, 1, 1));

    });

    test('solids clipping=false', async () => {
        mirror.origin = new THREE.Vector3();
        mirror.item = box;
        mirror.normal = new THREE.Vector3(0, 1, 0);
        mirror.clipping = false;

        const item = await mirror.commit() as visual.SpaceInstance<visual.Curve3D>;
        bbox.setFromObject(item);
        bbox.getCenter(center);
        expect(center).toApproximatelyEqual(new THREE.Vector3(0.5, -0.5, 0.5));
        expect(bbox.min).toApproximatelyEqual(new THREE.Vector3(0, -1, 0));
        expect(bbox.max).toApproximatelyEqual(new THREE.Vector3(1, 0, 1));
    })

    test('solids clipping=true', async () => {
        mirror.origin = new THREE.Vector3();
        mirror.item = box;
        mirror.normal = new THREE.Vector3(0, 1, 0);
        mirror.clipping = true;

        const item = await mirror.commit() as visual.SpaceInstance<visual.Curve3D>;
        bbox.setFromObject(item);
        bbox.getCenter(center);
        expect(center).toApproximatelyEqual(new THREE.Vector3(0.5, 0, 0.5));
        expect(bbox.min).toApproximatelyEqual(new THREE.Vector3(0, -1, 0));
        expect(bbox.max).toApproximatelyEqual(new THREE.Vector3(1, 1, 1));
    })
})