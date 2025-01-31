from flask import Flask, render_template, request, jsonify
import matplotlib.pyplot as plt
import io
import base64
import numpy as np

app = Flask(__name__)

def generate_plot(initial_gdp, costs, benefits, cybercrime_loss, investment, reduction):
    reduced_loss = cybercrime_loss * (reduction / 100)
    effective_loss = cybercrime_loss - reduced_loss
    final_gdp = initial_gdp - costs + benefits - effective_loss - investment
    net_benefit = benefits - (costs + effective_loss + investment)

    # Bar Chart
    labels = ['Initial GDP', 'Costs', 'Benefits', 'Cybercrime Loss', 'Investment', 'Final GDP']
    values = [initial_gdp, -costs, benefits, -effective_loss, -investment, final_gdp]
    fig, ax = plt.subplots()
    ax.bar(labels, values, color=['blue', 'red', 'green', 'orange', 'purple', 'blue'])
    ax.set_ylabel('Amount in $')
    plt.xticks(rotation=30, ha='right')
    plt.title('Economic Impact Breakdown')
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    bar_chart = base64.b64encode(buf.getvalue()).decode('utf-8')
    plt.close()

    # GDP Trend
    years = np.arange(5)
    gdp_trend = [initial_gdp - (i * (costs + investment) / 5) for i in years]
    fig, ax = plt.subplots()
    ax.plot(years, gdp_trend, marker='o', linestyle='-', color='blue')
    ax.set_xlabel('Years')
    ax.set_ylabel('GDP in $')
    plt.title('GDP Trend Over Time')
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    gdp_trend_chart = base64.b64encode(buf.getvalue()).decode('utf-8')
    plt.close()

    return net_benefit, final_gdp, effective_loss, reduced_loss, bar_chart, gdp_trend_chart

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        try:
            data = request.json
            initial_gdp = float(data['initial_gdp'])
            costs = float(data['costs'])
            benefits = float(data['benefits'])
            cybercrime_loss = float(data['cybercrime_loss'])
            investment = float(data['investment'])
            reduction = float(data['reduction'])

            net_benefit, final_gdp, effective_loss, reduced_loss, bar_chart, gdp_trend_chart = generate_plot(
                initial_gdp, costs, benefits, cybercrime_loss, investment, reduction)

            return jsonify({
                'net_benefit': net_benefit,
                'final_gdp': final_gdp,
                'effective_loss': effective_loss,
                'reduced_loss': reduced_loss,
                'bar_chart': bar_chart,
                'gdp_trend_chart': gdp_trend_chart
            })
        except Exception as e:
            return jsonify({'error': str(e)})
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
