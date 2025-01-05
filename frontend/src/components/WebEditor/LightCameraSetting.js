import React, { useState } from 'react';

const LightCameraSetting = ({
  sceneRef,
  cameraRef,
  axesHelperRef,
  gridHelperRef,
  sceneSettings,
  cameraPosition,
  setSceneSettings,
  setCameraPosition
}) => {

  const [axesHelperTrue, setAxesHelperTrue] = useState(true);
  const [gridHelperTrue, setGridHelperTrue] = useState(true);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setSceneSettings((prevSettings) => ({
      ...prevSettings,
      [id]: id.includes('Intensity') || id.includes('Pos') ? parseFloat(value) : value,
    }));
  };

  const handleCameraPositionChange = (axis, value) => {
    const newPosition = { ...cameraPosition, [axis]: value };
    setCameraPosition(newPosition);

    const camera = cameraRef.current;
    if (camera) {
      camera.position.set(newPosition.x, newPosition.y, newPosition.z);
      camera.updateProjectionMatrix(); // 카메라의 프로젝션 행렬 업데이트
    }
  };

  const resetLightControls = () => {
    setSceneSettings({
      directionalLightColor: "#ffffff",
      directionalLightIntensity: 1,
      ambientLightColor: "#ffffff",
      ambientLightIntensity: 1,
      directionalLightPosX: 0,
      directionalLightPosY: 1,
      directionalLightPosZ: 0,
    });
  };

  const resetCameraControls = () => {
    setCameraPosition({ x: 5, y: 5, z: 5 });
    cameraRef.current.position.x = 5;
    cameraRef.current.position.y = 5;
    cameraRef.current.position.z = 5;
  }

  const handleAxesHelper = () => {
    const scene = sceneRef.current;
    if (axesHelperTrue === true) {
      scene.remove(axesHelperRef.current);
      setAxesHelperTrue(!axesHelperTrue);
    }
    else {
      scene.add(axesHelperRef.current);
      setAxesHelperTrue(!axesHelperTrue);
    }
  }
  const handleGridHelper = () => {
    const scene = sceneRef.current;
    if (gridHelperTrue === true) {
      scene.remove(gridHelperRef.current);
      setGridHelperTrue(!gridHelperTrue);
    }
    else {
      scene.add(gridHelperRef.current);
      setGridHelperTrue(!gridHelperTrue);
    }
  }

  return (
    <div className="web-editor-light">
      <h3>Light Setup</h3>
      <div>
        <label>배경 색 변경 </label>
        <input type="color" id="rendererBackgroundColor" value={sceneSettings.rendererBackgroundColor} onChange={handleChange} />
      </div>
      <div>
        <label>Directional Light Color </label>
        <input type="color" id="directionalLightColor" value={sceneSettings.directionalLightColor} onChange={handleChange} />
        <label> Intensity :</label>
        <input type="range" id="directionalLightIntensity" min="0" max="5" step="0.01" value={sceneSettings.directionalLightIntensity} onChange={handleChange} />
      </div>
      <div>
        <label>Ambient Light Color </label>
        <input type="color" id="ambientLightColor" value={sceneSettings.ambientLightColor} onChange={handleChange} />
        <label> Intensity :</label>
        <input type="range" id="ambientLightIntensity" min="0" max="5" step="0.01" value={sceneSettings.ambientLightIntensity} onChange={handleChange} />
      </div>
      <div>
        <label>Directional Light Position X :</label>
        <input type="range" id="directionalLightPosX" min="-100" max="100" step="0.1" value={sceneSettings.directionalLightPosX} onChange={handleChange} />
      </div>
      <div>
        <label>Directional Light Position Y :</label>
        <input type="range" id="directionalLightPosY" min="-100" max="100" step="0.1" value={sceneSettings.directionalLightPosY} onChange={handleChange} />
      </div>
      <div>
        <label>Directional Light Position Z :</label>
        <input type="range" id="directionalLightPosZ" min="-100" max="100" step="0.1" value={sceneSettings.directionalLightPosZ} onChange={handleChange} />
      </div>
      <h3>Camera Position</h3>
      <label>X : </label>
      <input type="number" step="0.1" style={{ width: '50px' }} value={cameraPosition.x} onChange={(e) => handleCameraPositionChange('x', parseFloat(e.target.value))} />
      <label>Y : </label>
      <input type="number" step="0.1" style={{ width: '50px' }} value={cameraPosition.y} onChange={(e) => handleCameraPositionChange('y', parseFloat(e.target.value))} />
      <label>Z : </label>
      <input type="number" step="0.1" style={{ width: '50px' }} value={cameraPosition.z} onChange={(e) => handleCameraPositionChange('z', parseFloat(e.target.value))} /><br />
      <button type="button" onClick={resetLightControls} style={{ marginTop: '10px' }}>Reset Light</button>
      <button type="button" onClick={resetCameraControls}>Reset Camera</button>
      {axesHelperTrue ? <button onClick={handleAxesHelper}>AxesHelper OFF</button> : <button onClick={handleAxesHelper}>AxesHelper ON</button>}
      {gridHelperTrue ? <button onClick={handleGridHelper}>GridHelper OFF</button> : <button onClick={handleGridHelper}>GridHelper ON</button>}
    </div>
  );
};

export default LightCameraSetting;