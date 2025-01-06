import React, { useState } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';
import { outlineSetup, paddingMargin } from '../../utils/CSS';

const AddMesh = ({
    sceneRef,
    setObjects,
    selectedShape,
    setSelectedShape,
    selectedMaterial,
    setSelectedMaterial
}) => {

    const [shapeSettings, setShapeSettings] = useState({ // Add Meshes 모양 세팅
        length: 1, width: 1, height: 1, depth: 1, radius: 1, detail: 0,
        widthSegments: 1, heightSegments: 1, depthSegments: 1, radialSegments: 8, capSegments: 4, tubularSegments: 48,
        radiusTop: 1, radiusBottom: 1,
        thetaStart: 0, thetaLength: 2 * Math.PI,
        phiStart: 0, phiLength: 2 * Math.PI,
        tube: 0.4, arc: 2 * Math.PI, p: 2, q: 3,
        color: '#ffffff',
        posX: 0, posY: 0, posZ: 0,
    });

    const addShape = () => {
        const { length, width, height, depth, radius, detail,
            widthSegments, heightSegments, depthSegments, capSegments, radialSegments, tubularSegments,
            radiusTop, radiusBottom,
            thetaStart, thetaLength,
            phiStart, phiLength,
            arc, tube, p, q, color,
            posX, posY, posZ } = shapeSettings;
        let geometry;
        let material;

        // 재질 선택 로직
        switch (selectedMaterial) {
            case 'basic': material = new THREE.MeshBasicMaterial({ color });
                break;
            case 'standard': material = new THREE.MeshStandardMaterial({ color });
                break;
            case 'phong': material = new THREE.MeshPhongMaterial({ color });
                break;
            case 'lambert': material = new THREE.MeshLambertMaterial({ color });
                break;
            case 'matcap': material = new THREE.MeshMatcapMaterial({ color });
                break;
            case 'toon': material = new THREE.MeshToonMaterial({ color });
                break;
            case 'physical': material = new THREE.MeshPhysicalMaterial({ color });
                break;
            default: material = new THREE.MeshStandardMaterial({ color });
        }

        switch (selectedShape) {
            case 'box': geometry = new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments);
                break;
            case 'capsule': geometry = new THREE.CapsuleGeometry(radius, length, capSegments, radialSegments);
                break;
            case 'cone': geometry = new THREE.ConeGeometry(radius, height, radialSegments, heightSegments, false, thetaStart, thetaLength);
                break;
            case 'cylinder': geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, false, thetaStart, thetaLength);
                break;
            case 'tetrahydron': geometry = new THREE.TetrahedronGeometry(radius, detail);
                break;
            case 'octahedron': geometry = new THREE.OctahedronGeometry(radius, detail);
                break;
            case 'dodecahedron': geometry = new THREE.DodecahedronGeometry(radius, detail);
                break;
            case 'icosahedron': geometry = new THREE.IcosahedronGeometry(radius, detail);
                break;
            case 'sphere': geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);
                break;
            case 'torus': geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc);
                break;
            case 'torusknot': geometry = new THREE.TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q);
                break;
            default: geometry = new THREE.BoxGeometry(1, 1, 1);
        }

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(posX, posY, posZ);
        mesh.userData = {
            length, width, height, depth, radius, detail,
            widthSegments, heightSegments, depthSegments, capSegments, radialSegments, tubularSegments,
            radiusTop, radiusBottom,
            thetaStart, thetaLength,
            phiStart, phiLength,
            arc, tube, p, q, color,
            shape: selectedShape,
            material: selectedMaterial
        };

        sceneRef.current.add(mesh); // group
        setObjects((prevObjects) => [...prevObjects, mesh]);
    };
    
    return (
        <AddMeshContainer className="web-editor-add-mesh">
            <h3>새로운 도형 추가</h3>
            <div>
                <label>도형 선택 </label>
                <select value={selectedShape} onChange={(e) => setSelectedShape(e.target.value)}>
                    <option value="box">box</option>
                    <option value="capsule">캡슐</option>
                    <option value="cone">원뿔</option>
                    <option value="cylinder">원통</option>
                    <option value="tetrahydron">4면체</option>
                    <option value="octahedron">8면체</option>
                    <option value="dodecahedron">12면체</option>
                    <option value="icosahedron">20면체</option>
                    <option value="sphere">구</option>
                    <option value="torus">Torus</option>
                    <option value="torusknot">TorusKnot</option>
                </select>
            </div>
            <div>
                <label>재질 선택 </label>
                <select value={selectedMaterial} onChange={(e) => setSelectedMaterial(e.target.value)}>
                    <option value="basic">Basic</option>
                    <option value="lambert">Lambert</option>
                    <option value="matcap">Matcap</option>
                    <option value="phong">Phong</option>
                    <option value="physical">Physical</option>
                    <option value="standard">Standard</option>
                    <option value="toon">Toon</option>
                </select>
            </div>
            <div>
                <label>도형 색상 </label>
                <input type="color" id="color" value={shapeSettings.color} onChange={(e) => { setShapeSettings(prev => ({ ...prev, color: e.target.value })); }} />
            </div>
            <br />
            {selectedShape === 'box' &&
                <div>
                    <label>가로(Width):</label>
                    <input type="number" id="width" value={shapeSettings.width} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, width: parseFloat(e.target.value) })); }} /><br />
                    <label>세로(Height):</label>
                    <input type="number" id="height" value={shapeSettings.height} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, height: parseFloat(e.target.value) })); }} /><br />
                    <label>깊이(Depth):</label>
                    <input type="number" id="depth" value={shapeSettings.depth} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, depth: parseFloat(e.target.value) })); }} /><br />
                    <label title="x축으로 분할된 직사각형 면의 수">x축 세그먼트 수(WidthSegments):</label>
                    <input type="number" id="widthsegments" value={shapeSettings.widthSegments} min={1} max={100} onChange={(e) => { setShapeSettings(prev => ({ ...prev, widthSegments: parseInt(e.target.value, 10) })); }} /><br />
                    <label title="y축으로 분할된 직사각형 면의 수">y축 세그먼트 수(HeightSegments):</label>
                    <input type="number" id="heightsegments" value={shapeSettings.heightSegments} min={1} max={100} onChange={(e) => { setShapeSettings(prev => ({ ...prev, heightSegments: parseInt(e.target.value, 10) })); }} /><br />
                    <label title="z축으로 분할된 직사각형 면의 수">z축 세그먼트 수(DepthSegments):</label>
                    <input type="number" id="depthsegments" value={shapeSettings.depthSegments} min={1} max={100} onChange={(e) => { setShapeSettings(prev => ({ ...prev, depthSegments: parseInt(e.target.value, 10) })); }} /><br />
                </div>
            }
            {selectedShape === 'capsule' &&
                <div>
                    <label>반지름(Radius):</label>
                    <input type="number" id="radius" value={shapeSettings.radius} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, radius: parseFloat(e.target.value) })); }} /><br />
                    <label>길이(Length):</label>
                    <input type="number" id="length" value={shapeSettings.length} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, length: parseFloat(e.target.value) })); }} /><br />
                    <label title="캡슐 머리 부분을 중심으로 나뉘는 직사각형 면의 수">캡슐 세그먼트 수(CapSegments):</label>
                    <input type="number" id="capsegments" value={shapeSettings.capSegments} min={1} onChange={(e) => { setShapeSettings(prev => ({ ...prev, capSegments: parseInt(e.target.value, 10) })); }} /><br />
                    <label title="원형을 중심으로 나뉘는 직사각형 면의 수">원형 세그먼트 수(RadialSegments):</label>
                    <input type="number" id="radialsegments" value={shapeSettings.radialSegments} min={1} onChange={(e) => { setShapeSettings(prev => ({ ...prev, radialSegments: parseInt(e.target.value, 10) })); }} /><br />
                </div>
            }
            {selectedShape === 'cone' &&
                <div>
                    <label>반지름(Radius):</label>
                    <input type="number" id="radius" value={shapeSettings.radius} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, radius: parseFloat(e.target.value) })); }} /><br />
                    <label>세로(Height):</label>
                    <input type="number" id="height" value={shapeSettings.height} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, height: parseFloat(e.target.value) })); }} /><br />
                    <label title="원형을 중심으로 나뉘는 직사각형 면의 수">원형 세그먼트 수(RadialSegments):</label>
                    <input type="number" id="radialsegments" value={shapeSettings.radialSegments} min={3} onChange={(e) => { setShapeSettings(prev => ({ ...prev, radialSegments: parseInt(e.target.value, 10) })); }} /><br />
                    <label title="y축으로 분할된 직사각형 면의 수">y축 세그먼트 수(HeightSegments):</label>
                    <input type="number" id="heightsegments" value={shapeSettings.heightSegments} min={1} max={100} onChange={(e) => { setShapeSettings(prev => ({ ...prev, heightSegments: parseInt(e.target.value, 10) })); }} /><br />
                    <label title="원뿔 회전 각">원뿔 위치 회전(ThetaStart):</label>
                    <input type="number" id="thetastart" value={shapeSettings.thetaStart} min={0} max={Math.PI * 2} onChange={(e) => { setShapeSettings(prev => ({ ...prev, thetaStart: parseFloat(e.target.value) })); }} /><br />
                    <label title="원형 섹터의 중심 각">원뿔 중심 각(ThetaLength):</label>
                    <input type="number" id="thetalength" value={shapeSettings.thetaLength} min={0} max={Math.PI * 2} onChange={(e) => { setShapeSettings(prev => ({ ...prev, thetaLength: parseFloat(e.target.value) })); }} /><br />
                    <button type="button" onClick={() => { document.getElementById('thetalength').value = Math.PI; setShapeSettings(prev => ({ ...prev, thetaLength: Math.PI })); }}>Math.PI 변경</button>
                    <button type="button" onClick={() => { document.getElementById('thetalength').value = Math.PI * 2; setShapeSettings(prev => ({ ...prev, thetaLength: Math.PI * 2 })); }}>Math.PI * 2 변경</button>
                </div>
            }
            {selectedShape === 'cylinder' &&
                <div>
                    <label>원통 윗부분(RadiusTop):</label>
                    <input type="number" id="radiustop" value={shapeSettings.radiusTop} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, radiusTop: parseFloat(e.target.value) })); }} /><br />
                    <label>원통 아래부분(RadiusBottom):</label>
                    <input type="number" id="radiusbottom" value={shapeSettings.radiusBottom} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, radiusBottom: parseFloat(e.target.value) })); }} /><br />
                    <label>세로 (Height):</label>
                    <input type="number" id="height" value={shapeSettings.height} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, height: parseFloat(e.target.value) })); }} /><br />
                    <label title="원형을 중심으로 나뉘는 직사각형 면의 수">원형 세그먼트 수(RadialSegments):</label>
                    <input type="number" id="radialsegments" value={shapeSettings.radialSegments} min={3} onChange={(e) => { setShapeSettings(prev => ({ ...prev, radialSegments: parseInt(e.target.value, 10) })); }} /><br />
                    <label title="y축으로 분할된 직사각형 면의 수">y축 세그먼트 수(HeightSegments):</label>
                    <input type="number" id="heightsegments" value={shapeSettings.heightSegments} min={1} max={100} onChange={(e) => { setShapeSettings(prev => ({ ...prev, heightSegments: parseInt(e.target.value, 10) })); }} /><br />
                    <label title="원뿔 회전 각">원뿔 위치 회전(ThetaStart):</label>
                    <input type="number" id="thetastart" value={shapeSettings.thetaStart} min={0} max={Math.PI * 2} onChange={(e) => { setShapeSettings(prev => ({ ...prev, thetaStart: parseFloat(e.target.value) })); }} /><br />
                    <label title="원형 섹터의 중심 각">원뿔 중심 각(ThetaLength):</label>
                    <input type="number" id="thetalength" value={shapeSettings.thetaLength} min={0} max={Math.PI * 2} onChange={(e) => { setShapeSettings(prev => ({ ...prev, thetaLength: parseFloat(e.target.value) })); }} /><br />
                    <button type="button" onClick={() => { document.getElementById('thetalength').value = Math.PI; setShapeSettings(prev => ({ ...prev, thetaLength: Math.PI })); }}>Math.PI 변경</button>
                    <button type="button" onClick={() => { document.getElementById('thetalength').value = Math.PI * 2; setShapeSettings(prev => ({ ...prev, thetaLength: Math.PI * 2 })); }}>Math.PI * 2 변경</button>
                </div>
            }
            {selectedShape === 'tetrahydron' &&
                <div>
                    <label>반지름(Radius):</label>
                    <input type="number" id="radius" value={shapeSettings.radius} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, radius: parseFloat(e.target.value) })); }} /><br />
                    <label title="4면체 입니다. 0보다 커진다면 원형에 가까워집니다. 4면체의 기본값은 0입니다.">복잡도(Detail)</label>
                    <input type="number" id="detail" value={shapeSettings.detail} min={0} max={100} onChange={(e) => { setShapeSettings(prev => ({ ...prev, detail: parseInt(e.target.value, 10) })); }} /><br />
                </div>
            }
            {selectedShape === 'octahedron' &&
                <div>
                    <label>반지름(Radius):</label>
                    <input type="number" id="radius" value={shapeSettings.radius} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, radius: parseFloat(e.target.value) })); }} /><br />
                    <label title="8면체 입니다. 0보다 커진다면 원형에 가까워집니다. 8면체의 기본값은 0입니다.">복잡도(Detail)</label>
                    <input type="number" id="detail" value={shapeSettings.detail} min={0} max={100} onChange={(e) => { setShapeSettings(prev => ({ ...prev, detail: parseInt(e.target.value, 10) })); }} /><br />
                </div>
            }
            {selectedShape === 'dodecahedron' &&
                <div>
                    <label>반지름(Radius):</label>
                    <input type="number" id="radius" value={shapeSettings.radius} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, radius: parseFloat(e.target.value) })); }} /><br />
                    <label title="12면체 입니다. 0보다 커진다면 원형에 가까워집니다. 12면체의 기본값은 0입니다.">복잡도(Detail)</label>
                    <input type="number" id="detail" value={shapeSettings.detail} min={0} max={100} onChange={(e) => { setShapeSettings(prev => ({ ...prev, detail: parseInt(e.target.value, 10) })); }} /><br />
                </div>
            }
            {selectedShape === 'icosahedron' &&
                <div>
                    <label>반지름(Radius):</label>
                    <input type="number" id="radius" value={shapeSettings.radius} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, radius: parseFloat(e.target.value) })); }} /><br />
                    <label title="20면체 입니다. 0보다 커진다면 원형에 가까워집니다. 20면체의 기본값은 0입니다.">복잡도(Detail)</label>
                    <input type="number" id="detail" value={shapeSettings.detail} min={0} max={100} onChange={(e) => { setShapeSettings(prev => ({ ...prev, detail: parseInt(e.target.value, 10) })); }} /><br />
                </div>
            }
            {selectedShape === 'sphere' &&
                <div>
                    <label>반지름(Radius):</label>
                    <input type="number" id="radius" value={shapeSettings.radius} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, radius: parseFloat(e.target.value) })); }} /><br />
                    <label title="x축에서 보이는 변의 수">x축 세그먼트 수(WidthSegments):</label>
                    <input type="number" id="widthsegments" value={shapeSettings.widthSegments} min={2} max={100} onChange={(e) => { setShapeSettings(prev => ({ ...prev, widthSegments: parseInt(e.target.value, 10) })); }} /><br />
                    <label title="y축에서 보이는 변의 수">y축 세그먼트 수(HeightSegments):</label>
                    <input type="number" id="heightsegments" value={shapeSettings.heightSegments} min={3} max={100} onChange={(e) => { setShapeSettings(prev => ({ ...prev, heightSegments: parseInt(e.target.value, 10) })); }} /><br />
                    <label title="">구형 중점 회전(PhiStart):</label>
                    <input type="number" id="phistart" value={shapeSettings.phiStart} min={0} max={Math.PI * 2} onChange={(e) => { setShapeSettings(prev => ({ ...prev, phiStart: parseFloat(e.target.value) })); }} /><br />
                    <label title="">구형 중심 구현(PhiLength):</label>
                    <input type="number" id="philength" value={shapeSettings.phiLength} min={0} max={Math.PI * 2} onChange={(e) => { setShapeSettings(prev => ({ ...prev, phiLength: parseFloat(e.target.value) })); }} /><br />
                    <button type="button" onClick={() => { document.getElementById('philength').value = Math.PI; setShapeSettings(prev => ({ ...prev, phiLength: Math.PI })); }}>Math.PI 변경</button>
                    <button type="button" onClick={() => { document.getElementById('philength').value = Math.PI * 2; setShapeSettings(prev => ({ ...prev, phiLength: Math.PI * 2 })); }}>Math.PI * 2 변경</button><br />
                    <label title="원뿔 회전 각">점 중심 회전(ThetaStart):</label>
                    <input type="number" id="thetastart" value={shapeSettings.thetaStart} min={0} max={Math.PI * 2} onChange={(e) => { setShapeSettings(prev => ({ ...prev, thetaStart: parseFloat(e.target.value) })); }} /><br />
                    <label title="원형 섹터의 중심 각">점 중심 구현(ThetaLength):</label>
                    <input type="number" id="thetalength" value={shapeSettings.thetaLength} min={0} max={Math.PI * 2} onChange={(e) => { setShapeSettings(prev => ({ ...prev, thetaLength: parseFloat(e.target.value) })); }} /><br />
                    <button type="button" onClick={() => { document.getElementById('thetalength').value = Math.PI; setShapeSettings(prev => ({ ...prev, thetaLength: Math.PI })); }}>Math.PI 변경</button>
                    <button type="button" onClick={() => { document.getElementById('thetalength').value = Math.PI * 2; setShapeSettings(prev => ({ ...prev, thetaLength: Math.PI * 2 })); }}>Math.PI * 2 변경</button>
                </div>
            }
            {selectedShape === 'torus' &&
                <div>
                    <label>반지름(Radius):</label>
                    <input type="number" id="radius" value={shapeSettings.radius} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, radius: parseFloat(e.target.value) })); }} /><br />
                    <label title="torus 를 감싸는 튜브의 두께">튜브(Tube):</label>
                    <input type="number" id="tube" value={shapeSettings.tube} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, tube: parseFloat(e.target.value) })); }} /><br />
                    <label title="튜브의 정점 조절. 숫자가 커질수록 원형에 가까워짐">원형 세그먼트 수(RadialSegments):</label>
                    <input type="number" id="radialsegments" value={shapeSettings.radialSegments} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, radialSegments: parseInt(e.target.value, 10) })); }} /><br />
                    <label title="튜브의 구간 개수 조절. 숫자가 커질수록 구간 별로 촘촘해짐">튜브 세그먼트 수(TubularSegments):</label>
                    <input type="number" id="tubularsegments" value={shapeSettings.tubularSegments} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, tubularSegments: parseInt(e.target.value, 10) })); }} /><br />
                    <label title="torus 가 생성되는 회전 각">Torus 생성 각(Arc):</label>
                    <input type="number" id="arc" value={shapeSettings.arc} min={0} max={Math.PI * 2} onChange={(e) => { setShapeSettings(prev => ({ ...prev, arc: parseFloat(e.target.value) })); }} /><br />
                    <button type="button" onClick={() => { document.getElementById('arc').value = Math.PI; setShapeSettings(prev => ({ ...prev, arc: Math.PI })); }}>Math.PI 변경</button>
                    <button type="button" onClick={() => { document.getElementById('arc').value = Math.PI * 2; setShapeSettings(prev => ({ ...prev, arc: Math.PI * 2 })); }}>Math.PI * 2 변경</button>
                </div>
            }
            {selectedShape === 'torusknot' &&
                <div>
                    <label>반지름(Radius):</label>
                    <input type="number" id="radius" value={shapeSettings.radius} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, radius: parseFloat(e.target.value) })); }} /><br />
                    <label title="torus 를 감싸는 튜브의 두께">튜브(Tube):</label>
                    <input type="number" id="tube" value={shapeSettings.tube} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, tube: parseFloat(e.target.value) })); }} /><br />
                    <label title="튜브의 구간 개수 조절. 숫자가 커질수록 구간 별로 촘촘해짐">튜브 세그먼트 수(TubularSegments):</label>
                    <input type="number" id="tubularsegments" value={shapeSettings.tubularSegments} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, tubularSegments: parseInt(e.target.value, 10) })); }} /><br />
                    <label title="튜브의 정점 조절. 숫자가 커질수록 원형에 가까워짐">원형 세그먼트 수(RadialSegments):</label>
                    <input type="number" id="radialsegments" value={shapeSettings.radialSegments} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, radialSegments: parseInt(e.target.value, 10) })); }} /><br />
                    <label title="기하학적 회전 대칭 축 감김 정도">(P)</label>
                    <input type="number" id="p" value={shapeSettings.p} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, p: parseInt(e.target.value, 10) })); }} /><br />
                    <label title="torus 내부 원을 감은 정도">(Q)</label>
                    <input type="number" id="q" value={shapeSettings.q} min={0} onChange={(e) => { setShapeSettings(prev => ({ ...prev, q: parseInt(e.target.value, 10) })); }} /><br />
                </div>
            }
            <div>
                <label>X : </label>
                <input style={{ width: "40px" }} type="number" id="posX" value={shapeSettings.posX} onChange={(e) => { setShapeSettings(prev => ({ ...prev, posX: parseFloat(e.target.value) })); }} />
                <label> Y : </label>
                <input style={{ width: "40px" }} type="number" id="posY" value={shapeSettings.posY} onChange={(e) => { setShapeSettings(prev => ({ ...prev, posY: parseFloat(e.target.value) })); }} />
                <label> Z : </label>
                <input style={{ width: "40px" }} type="number" id="posZ" value={shapeSettings.posZ} onChange={(e) => { setShapeSettings(prev => ({ ...prev, posZ: parseFloat(e.target.value) })); }} />
            </div><br />
            <button type="button" onClick={addShape}>매쉬 추가</button>
        </AddMeshContainer>
    );
};

export default AddMesh;

const AddMeshContainer = styled.div`
       ${paddingMargin('10px', '0 0', '10px', '0')}
           ${outlineSetup()}
        font-weight: bold;
        background-color: rgba(73, 169, 61, 0.7);
`;