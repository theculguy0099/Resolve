import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from "chart.js/auto";
import { useState } from 'react';
import { Userdata } from './department_data';


export const Barchart = () => {

    const [chartData, setChartData] = useState({
        labels: Userdata.map((data) => data.name),
        datasets: [
            {
                label: 'Complaints',
                data: Userdata.map((data) => data.complaint_type.length),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                ]
            }
        ]
    });

    return (
        <div>
            <div className="w-full md:w-2/2 lg:w-2/3 xl:w-2/2">
                <Bar
                    data={chartData}
                    options={{
                        title: {
                            display: true,
                            text: 'Complaints by Department',
                            fontSize: 25
                        },
                        legend: {
                            display: true,
                            position: 'right'
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default Barchart;