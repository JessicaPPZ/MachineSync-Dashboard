import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from 'recharts';
import './App.css';

function App() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [alarms, setAlarms] = useState([]);
  const [newAlarm, setNewAlarm] = useState({
    name: '',
    sta: '',
    criticality: 'Media',
    solution: ''
  });
  const [editingAlarm, setEditingAlarm] = useState(null);
  const [newSta, setNewSta] = useState('');
  const [editingSta, setEditingSta] = useState(null);
  const [viewingAlarms, setViewingAlarms] = useState(null);
  const [showAllAlarms, setShowAllAlarms] = useState(false);
  const [areaFilter, setAreaFilter] = useState('');
  const [staFilter, setStaFilter] = useState('');
  const [criticalityFilter, setCriticalityFilter] = useState('');
  const [selectedAlarm, setSelectedAlarm] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [areas, setAreas] = useState([
    { name: 'Upper', stations: ['110', '120', '130'], x: 30, y: 35 },
    { name: 'Lower', stations: ['210', '220', '230'], x: 70, y: 65 },
    { name: 'PCBA', stations: ['310', '320', '330'], x: 40, y: 60 },
    { name: 'DLT', stations: ['410', '420'], x: 60, y: 60 },
    { name: 'Alpine', stations: ['510', '520', '530'], x: 35, y: 50 },
    { name: 'Final', stations: ['610', '620', '630'], x: 50, y: 25 },
    { name: 'Serter', stations: ['710', '720'], x: 65, y: 40 }
  ]);

  // Datos para la gráfica
  const criticalityWeight = { Alta: 3, Media: 2, Baja: 1 };
  const chartData = areas.map((area) => {
    const areaAlarms = alarms.filter((alarm) => alarm.area === area.name);
    const avgCriticality =
      areaAlarms.length > 0
        ? areaAlarms.reduce((sum, alarm) => sum + criticalityWeight[alarm.criticality], 0) /
          areaAlarms.length
        : 0;
    return {
      name: area.name,
      criticality: avgCriticality,
      alarms: areaAlarms.length
    };
  });

  const handleAreaClick = (area) => {
    setSelectedArea(area);
    setViewingAlarms(null);
    setEditingAlarm(null);
    setNewSta('');
    setEditingSta(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAlarm({ ...newAlarm, [name]: value });
  };

  const handleEditAlarmChange = (e) => {
    const { name, value } = e.target;
    setEditingAlarm({ ...editingAlarm, [name]: value });
  };

  const handleAddAlarm = (e) => {
    e.preventDefault();
    setAlarms([...alarms, { ...newAlarm, area: selectedArea.name }]);
    setNewAlarm({ name: '', sta: '', criticality: 'Media', solution: '' });
    console.log('Nueva alarma:', { ...newAlarm, area: selectedArea.name });
  };

  const handleEditAlarm = (e) => {
    e.preventDefault();
    setAlarms(
      alarms.map((alarm, index) =>
        index === editingAlarm.index ? { ...editingAlarm, area: editingAlarm.area } : alarm
      )
    );
    setEditingAlarm(null);
    console.log('Alarma editada:', editingAlarm);
  };

  const handleDeleteAlarm = (index) => {
    setAlarms(alarms.filter((_, i) => i !== index));
    setEditingAlarm(null);
    console.log('Alarma eliminada:', index);
  };

  const handleAddSta = (e) => {
    e.preventDefault();
    if (newSta && !selectedArea.stations.includes(newSta)) {
      const updatedStations = [...selectedArea.stations, newSta].sort((a, b) => parseInt(b) - parseInt(a));
      setAreas(
        areas.map((area) =>
          area.name === selectedArea.name
            ? { ...area, stations: updatedStations }
            : area
        )
      );
      setSelectedArea({
        ...selectedArea,
        stations: updatedStations
      });
      setNewSta('');
    }
  };

  const handleEditSta = (e) => {
    e.preventDefault();
    if (editingSta && editingSta.newValue && !selectedArea.stations.includes(editingSta.newValue)) {
      const oldSta = editingSta.value;
      const updatedStations = selectedArea.stations
        .map((sta, index) => (index === editingSta.index ? editingSta.newValue : sta))
        .sort((a, b) => parseInt(b) - parseInt(a));
      setAreas(
        areas.map((area) =>
          area.name === selectedArea.name
            ? { ...area, stations: updatedStations }
            : area
        )
      );
      setSelectedArea({
        ...selectedArea,
        stations: updatedStations
      });
      setAlarms(
        alarms.map((alarm) =>
          alarm.area === selectedArea.name && alarm.sta === oldSta
            ? { ...alarm, sta: editingSta.newValue }
            : alarm
        )
      );
      setEditingSta(null);
    }
  };

  const handleDeleteSta = (index) => {
    const deletedSta = selectedArea.stations[index];
    const updatedStations = selectedArea.stations
      .filter((_, i) => i !== index)
      .sort((a, b) => parseInt(b) - parseInt(a));
    setAreas(
      areas.map((area) =>
        area.name === selectedArea.name
          ? { ...area, stations: updatedStations }
          : area
      )
    );
    setSelectedArea({
      ...selectedArea,
      stations: updatedStations
    });
    setAlarms(alarms.filter((alarm) => alarm.area !== selectedArea.name || alarm.sta !== deletedSta));
    setEditingSta(null);
  };

  const handleViewAlarms = (sta) => {
    setViewingAlarms(sta);
    setEditingAlarm(null);
  };

  const handleViewAllAlarms = () => {
    setShowAllAlarms(true);
    setSelectedArea(null);
    setEditingAlarm(null);
  };

  const handleAreaFilterChange = (e) => {
    setAreaFilter(e.target.value);
  };

  const handleStaFilterChange = (e) => {
    setStaFilter(e.target.value);
  };

  const handleCriticalityFilterChange = (e) => {
    setCriticalityFilter(e.target.value);
  };

  const handleViewAlarmDetail = (alarm) => {
    setSelectedAlarm(alarm);
  };

  const startEditAlarm = (alarm, index) => {
    setEditingAlarm({ ...alarm, index });
    setSelectedArea(areas.find((a) => a.name === alarm.area));
  };

  const handleEditStaClick = (sta, index) => {
    setEditingSta({ value: sta, newValue: sta, index });
  };

  const handleEditArea = (index, field, value) => {
    setAreas(
      areas.map((area, i) =>
        i === index ? { ...area, [field]: field === 'name' ? value : parseFloat(value) } : area
      )
    );
    if (selectedArea && selectedArea.name === areas[index].name) {
      setSelectedArea({
        ...selectedArea,
        [field]: field === 'name' ? value : parseFloat(value)
      });
    }
    if (field === 'name') {
      setAlarms(
        alarms.map((alarm) =>
          alarm.area === areas[index].name ? { ...alarm, area: value } : alarm
        )
      );
    }
  };

  const filteredAlarms = alarms.filter((alarm) => {
    return (
      (!areaFilter || alarm.area === areaFilter) &&
      (!staFilter || alarm.sta === staFilter) &&
      (!criticalityFilter || alarm.criticality === criticalityFilter)
    );
  });

  return (
    <div className="App" style={{ textAlign: 'center', padding: '5px' }}>
      <h1 style={{ zIndex: 10, position: 'relative', margin: '10px 0' }}>
        MachineSync Dashboard - Línea de Producción
      </h1>
      <div className="linea-produccion" style={{ position: 'relative', width: '100%', height: '600px' }}>
        <img
          src="/static/auto.png"
          alt="Línea de Producción"
          style={{
            maxWidth: '50%',
            height: 'auto',
            position: 'absolute',
            top: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1
          }}
        />
        {areas.map((area, index) => (
          <div
            key={index}
            className="area"
            onDoubleClick={() => handleAreaClick(area)}
            style={{
              position: 'absolute',
              left: `${area.x}%`,
              top: `${area.y}%`,
              width: '100px',
              height: '80px',
              backgroundColor: '#ffffff',
              border: '1px solid #e0e0e0',
              borderRadius: '5px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 2,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{ fontWeight: 'bold' }}>{area.name}</div>
            <div className="stations" style={{ fontSize: '10px', lineHeight: '1.2' }}>
              {area.stations.map((sta, sIndex) => (
                <div key={sIndex}>{sta}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="chart-container" style={{ marginTop: '20px' }}>
        <h2 style={{ margin: '10px 0' }}>Resumen de Alarmas por Área</h2>
        <BarChart width={600} height={300} data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" stroke="#333" fontSize={12} />
          <YAxis
            domain={[0, 3]}
            ticks={[1, 2, 3]}
            tickFormatter={(value) => ['Baja', 'Media', 'Alta'][value - 1] || ''}
            stroke="#333"
            fontSize={12}
            label={{ value: 'Criticidad Promedio', angle: -90, position: 'insideLeft', offset: -25, fontSize: 12 }}
          />
          <Tooltip
            formatter={(value, name, props) => [
              name === 'criticality' ? ['Baja', 'Media', 'Alta'][Math.round(value) - 1] || value : value,
              name === 'criticality' ? 'Criticidad Promedio' : 'Número de Alarmas'
            ]}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '5px', fontSize: 12 }}
          />
          <Bar dataKey="criticality" fill="#4b5e8e" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="alarms" position="top" fontSize={12} fill="#333" />
          </Bar>
        </BarChart>
      </div>
      {selectedArea && (
        <div className="modal">
          <h2 style={{ margin: '5px 0' }}>{selectedArea.name}</h2>
          <div className="sta-list">
            {selectedArea.stations.map((sta, index) => (
              <div key={index} className="sta-item">
                <span>STA {sta}</span>
                <button
                  onClick={() => handleEditStaClick(sta, index)}
                  className="small-button edit-button"
                >
                  Editar STA
                </button>
                <button
                  onClick={() => handleDeleteSta(index)}
                  className="small-button delete-button"
                >
                  Eliminar STA
                </button>
                <button
                  onClick={() => handleViewAlarms(sta)}
                  className="small-button view-button"
                >
                  Ver Alarmas
                </button>
                {viewingAlarms === sta && (
                  <div className="alarms-list">
                    <h3 style={{ margin: '5px 0' }}>Alarmas para STA {sta}</h3>
                    {alarms
                      .filter((alarm) => alarm.area === selectedArea.name && alarm.sta === sta)
                      .map((alarm, index) => (
                        <div
                          key={index}
                          style={{
                            margin: '5px 0',
                            padding: '5px',
                            border: '1px solid #eee',
                            textAlign: 'left',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          <div style={{ display: 'flex' }}>
                            <strong style={{ width: '100px' }}>Nombre:</strong>
                            <span>{alarm.name}</span>
                          </div>
                          <div style={{ display: 'flex' }}>
                            <strong style={{ width: '100px' }}>Criticidad:</strong>
                            <span>{alarm.criticality}</span>
                          </div>
                          <div style={{ display: 'flex' }}>
                            <strong style={{ width: '100px' }}>Solución:</strong>
                            <span className="solution-text">
                              {alarm.solution.length > 50
                                ? alarm.solution.substring(0, 50) + '...'
                                : alarm.solution}
                              {alarm.solution.length > 50 && (
                                <button
                                  onClick={() => handleViewAlarmDetail(alarm)}
                                  className="small-button detail-button"
                                >
                                  Ver Detalle
                                </button>
                              )}
                            </span>
                          </div>
                          <div style={{ marginTop: '5px' }}>
                            <button
                              onClick={() => startEditAlarm(alarm, alarms.findIndex((a) => a === alarm))}
                              className="small-button edit-button"
                            >
                              Editar Alarma
                            </button>
                            <button
                              onClick={() => handleDeleteAlarm(alarms.findIndex((a) => a === alarm))}
                              className="small-button delete-button"
                            >
                              Eliminar Alarma
                            </button>
                          </div>
                        </div>
                      ))}
                    {alarms.filter((alarm) => alarm.area === selectedArea.name && alarm.sta === sta).length === 0 && (
                      <p>No hay alarmas para esta STA.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="sta-form">
            <h3 style={{ margin: '5px 0' }}>Añadir Nueva STA</h3>
            <form onSubmit={handleAddSta}>
              <div style={{ margin: '5px 0', textAlign: 'left' }}>
                <label style={{ display: 'block', fontWeight: 'bold' }}>Nueva STA:</label>
                <input
                  type="text"
                  value={newSta}
                  onChange={(e) => setNewSta(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <button type="submit" className="small-button submit-button">
                Añadir STA
              </button>
            </form>
          </div>
          {editingSta && (
            <div className="sta-form">
              <h3 style={{ margin: '5px 0' }}>Editar STA</h3>
              <form onSubmit={handleEditSta}>
                <div style={{ margin: '5px 0', textAlign: 'left' }}>
                  <label style={{ display: 'block', fontWeight: 'bold' }}>Editar STA {editingSta.value}:</label>
                  <input
                    type="text"
                    value={editingSta.newValue}
                    onChange={(e) => setEditingSta({ ...editingSta, newValue: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <button type="submit" className="small-button submit-button">
                  Guardar STA
                </button>
                <button
                  onClick={() => setEditingSta(null)}
                  className="small-button cancel-button"
                >
                  Cancelar
                </button>
              </form>
            </div>
          )}
          <div className="alarm-form">
            <h3 style={{ margin: '5px 0' }}>
              {editingAlarm ? 'Editar Alarma' : 'Crear Nueva Alarma'}
            </h3>
            <form onSubmit={editingAlarm ? handleEditAlarm : handleAddAlarm}>
              <div style={{ margin: '5px 0', textAlign: 'left' }}>
                <label style={{ display: 'block', fontWeight: 'bold' }}>
                  Nombre de la Alarma (HMI):
                </label>
                <input
                  type="text"
                  name="name"
                  value={editingAlarm ? editingAlarm.name : newAlarm.name}
                  onChange={editingAlarm ? handleEditAlarmChange : handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div style={{ margin: '5px 0', textAlign: 'left' }}>
                <label style={{ display: 'block', fontWeight: 'bold' }}>
                  STA:
                </label>
                <select
                  name="sta"
                  value={editingAlarm ? editingAlarm.sta : newAlarm.sta}
                  onChange={editingAlarm ? handleEditAlarmChange : handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="">Seleccionar STA</option>
                  {selectedArea.stations.map((sta, index) => (
                    <option key={index} value={sta}>{sta}</option>
                  ))}
                </select>
              </div>
              <div style={{ margin: '5px 0', textAlign: 'left' }}>
                <label style={{ display: 'block', fontWeight: 'bold' }}>
                  Criticidad:
                </label>
                <select
                  name="criticality"
                  value={editingAlarm ? editingAlarm.criticality : newAlarm.criticality}
                  onChange={editingAlarm ? handleEditAlarmChange : handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
              <div style={{ margin: '5px 0', textAlign: 'left' }}>
                <label style={{ display: 'block', fontWeight: 'bold' }}>
                  Solución:
                </label>
                <textarea
                  name="solution"
                  value={editingAlarm ? editingAlarm.solution : newAlarm.solution}
                  onChange={editingAlarm ? handleEditAlarmChange : handleInputChange}
                  className="form-input solution-input"
                  required
                />
              </div>
              <button
                type="submit"
                className="small-button submit-button"
              >
                {editingAlarm ? 'Guardar Alarma' : 'Añadir Alarma'}
              </button>
              {editingAlarm && (
                <button
                  onClick={() => setEditingAlarm(null)}
                  className="small-button cancel-button"
                >
                  Cancelar
                </button>
              )}
            </form>
          </div>
          <button
            onClick={() => setSelectedArea(null)}
            className="small-button cancel-button"
          >
            Cerrar
          </button>
        </div>
      )}
      {selectedAlarm && (
        <div className="modal">
          <h2 style={{ margin: '5px 0' }}>Detalles de la Alarma</h2>
          <div style={{ margin: '10px 0', textAlign: 'left' }}>
            <div><strong>Área:</strong> {selectedAlarm.area}</div>
            <div><strong>STA:</strong> {selectedAlarm.sta}</div>
            <div><strong>Nombre:</strong> {selectedAlarm.name}</div>
            <div><strong>Criticidad:</strong> {selectedAlarm.criticality}</div>
            <div><strong>Solución:</strong> <span className="solution-text">{selectedAlarm.solution}</span></div>
          </div>
          <button
            onClick={() => setSelectedAlarm(null)}
            className="small-button cancel-button"
          >
            Volver
          </button>
        </div>
      )}
      {showAllAlarms && (
        <div className="modal modal-wide">
          <h2 style={{ margin: '5px 0' }}>Todas las Alarmas</h2>
          <div className="filter-container">
            <div>
              <label>Filtrar por Área:</label>
              <select
                value={areaFilter}
                onChange={handleAreaFilterChange}
                className="form-input filter-input"
              >
                <option value="">Todas las Áreas</option>
                {areas.map((area, index) => (
                  <option key={index} value={area.name}>{area.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Filtrar por STA:</label>
              <select
                value={staFilter}
                onChange={handleStaFilterChange}
                className="form-input filter-input"
              >
                <option value="">Todas las STA</option>
                {[...new Set(alarms.map((alarm) => alarm.sta))].map((sta, index) => (
                  <option key={index} value={sta}>{sta}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Filtrar por Criticidad:</label>
              <select
                value={criticalityFilter}
                onChange={handleCriticalityFilterChange}
                className="form-input filter-input"
              >
                <option value="">Todas las Criticidades</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '5px' }}>Área</th>
                <th style={{ border: '1px solid #ccc', padding: '5px' }}>STA</th>
                <th style={{ border: '1px solid #ccc', padding: '5px' }}>Nombre</th>
                <th style={{ border: '1px solid #ccc', padding: '5px' }}>Criticidad</th>
                <th style={{ border: '1px solid #ccc', padding: '5px' }}>Solución</th>
                <th style={{ border: '1px solid #ccc', padding: '5px' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlarms.length > 0 ? (
                filteredAlarms.map((alarm, index) => (
                  <tr key={index}>
                    <td style={{ border: '1px solid #ccc', padding: '5px' }}>{alarm.area}</td>
                    <td style={{ border: '1px solid #ccc', padding: '5px' }}>{alarm.sta}</td>
                    <td style={{ border: '1px solid #ccc', padding: '5px' }}>{alarm.name}</td>
                    <td style={{ border: '1px solid #ccc', padding: '5px' }}>{alarm.criticality}</td>
                    <td style={{ border: '1px solid #ccc', padding: '5px' }}>
                      <span className="solution-text">
                        {alarm.solution.length > 50
                          ? alarm.solution.substring(0, 50) + '...'
                          : alarm.solution}
                      </span>
                      {alarm.solution.length > 50 && (
                        <button
                          onClick={() => handleViewAlarmDetail(alarm)}
                          className="small-button detail-button"
                        >
                          Ver Detalle
                        </button>
                      )}
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '5px' }}>
                      <button
                        onClick={() => {
                          setSelectedArea(areas.find((a) => a.name === alarm.area));
                          startEditAlarm(alarm, index);
                        }}
                        className="small-button edit-button"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteAlarm(index)}
                        className="small-button delete-button"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '10px' }}>
                    No hay alarmas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <button
            onClick={() => setShowAllAlarms(false)}
            className="small-button cancel-button"
          >
            Cerrar
          </button>
        </div>
      )}
      {showConfigModal && (
        <div className="modal">
          <h2 style={{ margin: '5px 0' }}>Configurar Áreas</h2>
          <div className="area-config-list">
            {areas.map((area, index) => (
              <div key={index} className="area-config-item">
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                  Área {area.name}
                </label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label>Nombre:</label>
                    <input
                      type="text"
                      value={area.name}
                      onChange={(e) => handleEditArea(index, 'name', e.target.value)}
                      className="form-input"
                      style={{ width: '150px' }}
                      required
                    />
                  </div>
                  <div>
                    <label>Posición X (%):</label>
                    <input
                      type="number"
                      value={area.x}
                      onChange={(e) => handleEditArea(index, 'x', e.target.value)}
                      className="form-input"
                      style={{ width: '100px' }}
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                  <div>
                    <label>Posición Y (%):</label>
                    <input
                      type="number"
                      value={area.y}
                      onChange={(e) => handleEditArea(index, 'y', e.target.value)}
                      className="form-input"
                      style={{ width: '100px' }}
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowConfigModal(false)}
            className="small-button cancel-button"
          >
            Cerrar
          </button>
        </div>
      )}
      <button
        onClick={handleViewAllAlarms}
        className="small-button view-all-button"
      >
        Ver Todas las Alarmas
      </button>
      <button
        onClick={() => setShowConfigModal(true)}
        className="small-button config-button"
        title="Configurar Áreas"
      >
        ⚙️
      </button>
    </div>
  );
}

export default App;