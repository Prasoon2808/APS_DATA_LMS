import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Unwatched', value: 60 },
  { name: 'Watched', value: 40 },
];

const COLORS = ['#777777', '#a8cd3d'];

const ProgressChart = () => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const watched = data.find(d => d.name === 'Watched')?.value || 0;
  const watchedPercent = ((watched / total) * 100).toFixed(0);

  return (
    <div style={{ width: '100%', height: 230, position: 'relative' }}>
      {/* Overlay Title + Subtitle */}
      <div style={{
        position: 'absolute',
        top: 8,
        width: '100%',
        textAlign: 'center',
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>Progress</p>
        <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>{watchedPercent}% Watched</p>
      </div>

      {/* Chart */}
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="35%"
            cy="53%"
            innerRadius="40%"
            outerRadius="70%"
            fill="#8884d8"
            paddingAngle={3}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
