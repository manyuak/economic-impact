document.getElementById('simulationForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const data = {
        initial_gdp: document.getElementById('initial_gdp').value,
        costs: document.getElementById('costs').value,
        benefits: document.getElementById('benefits').value,
        cybercrime_loss: document.getElementById('cybercrime_loss').value,
        investment: document.getElementById('investment').value,
        reduction_percentage: document.getElementById('reduction_percentage').value
    };

    try {
        const response = await fetch('/simulate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            
            document.getElementById('net_benefit').innerText = result.net_benefit.toFixed(2);
            document.getElementById('final_gdp').innerText = result.final_gdp.toFixed(2);
            document.getElementById('effective_cybercrime_loss').innerText = result.effective_cybercrime_loss.toFixed(2);
            document.getElementById('reduced_loss').innerText = result.reduced_loss.toFixed(2);

            document.getElementById('results').style.display = 'block';
            
            // Plot the bar chart using Chart.js
            const ctxBar = document.getElementById('resultsChart').getContext('2d');
            new Chart(ctxBar, {
                type: 'bar',
                data: {
                    labels: ['Initial GDP', 'Final GDP', 'Net Benefit', 'Effective Cybercrime Loss', 'Reduced Loss'],
                    datasets: [{
                        label: 'Economic Impact',
                        data: [data.initial_gdp, result.final_gdp, result.net_benefit, result.effective_cybercrime_loss, result.reduced_loss],
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 99, 132, 0.2)'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Plot the line chart using Chart.js
            const ctxLine = document.getElementById('trendChart').getContext('2d');
            new Chart(ctxLine, {
                type: 'line',
                data: {
                    labels: ['Initial GDP', 'Final GDP'],
                    datasets: [{
                        label: 'GDP Trend',
                        data: [data.initial_gdp, result.final_gdp],
                        fill: false,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        tension: 0.1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Plot the pie chart using Chart.js
            const ctxPie = document.getElementById('distributionChart').getContext('2d');
            new Chart(ctxPie, {
                type: 'pie',
                data: {
                    labels: ['Net Benefit', 'Effective Cybercrime Loss', 'Reduced Loss'],
                    datasets: [{
                        label: 'Distribution',
                        data: [result.net_benefit, result.effective_cybercrime_loss, result.reduced_loss],
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 99, 132, 0.2)'
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 1
                    }]
                }
            });

            // Plot additional charts using Chart.js
            const ctxAdditional1 = document.getElementById('additionalChart1').getContext('2d');
            new Chart(ctxAdditional1, {
                type: 'line',
                data: {
                    labels: ['Initial GDP', 'Final GDP', 'Net Benefit', 'Effective Cybercrime Loss', 'Reduced Loss'],
                    datasets: [{
                        label: 'Additional Chart 1',
                        data: [data.initial_gdp, result.final_gdp, result.net_benefit, result.effective_cybercrime_loss, result.reduced_loss],
                        fill: false,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        tension: 0.1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            const ctxAdditional2 = document.getElementById('additionalChart2').getContext('2d');
            new Chart(ctxAdditional2, {
                type: 'bar',
                data: {
                    labels: ['Initial GDP', 'Final GDP', 'Net Benefit', 'Effective Cybercrime Loss', 'Reduced Loss'],
                    datasets: [{
                        label: 'Additional Chart 2',
                        data: [data.initial_gdp, result.final_gdp, result.net_benefit, result.effective_cybercrime_loss, result.reduced_loss],
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        } else {
            console.error('Server error:', response.statusText);
            alert('Error: Unable to perform simulation. Please try again later.');
        }
    } catch (error) {
        console.error('Request failed:', error);
        alert('Error: Unable to perform simulation. Please check your network connection and try again.');
    }
});