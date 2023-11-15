import React, { useEffect } from "react";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const ScoreGraph = ({data}) => {

    useEffect(() => {
        console.log("Score Chart Data:", data)
    })

    return (
        <>
        {/* <BarChart width={500} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <XAxis dataKey="name"/>
            <YAxis/>
            <Bar dataKey="score" fill="#8884d8"/>
        </BarChart> */}
        <BarChart width={600} height={300} data={data} margin={{top: 10, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
            <XAxis dataKey="name"/>
            <YAxis type="number" domain={[0, 10]} ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} allowDecimals={false} interval={0} />
            <Bar dataKey="score" fill="#8884d8"/>
        </BarChart>
        </>
    )
}

export default ScoreGraph