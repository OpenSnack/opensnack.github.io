import * as d3 from 'd3';

import {View} from './View.js';

export class TooltipView extends View {
    constructor(model, container, parent) {
        super(model, container, parent);

        this._months = 6;
    }

    init(callback) {
        this.createContainers();

        this.xScale = d3.scaleLinear()
            .domain([0, this._months]);

        this.yScale = d3.scaleLinear();

        this.path = this.chart
          .append('path')
            .classed('tooltip-chart-line', true);

        // fix this stuff later

        this.container
            .style('width', 200)
            .style('height', 80);

        this.chart
            .style('height', 60);

        this.title.text('Alaska');
        this.value.text('3000');
        this.growth.text('(+200)');

        this.update();
    }

    update(params) {
        const data = this.model.currentTooltipData();

        if (data) {
            this.title.text(data.properties.name);
            this.value.text(Math.round(data.currentRating * data.percent));

            const growth = Math.round((data.currentRating - Number(data.Rating)) * data.percent);
            const sign = Math.sign(growth) >= 0 ? '+' : '';
            this.growth.text(`(${sign}${growth})`);

            const chartRect = this.chart.node().getBoundingClientRect();
            const maxGrowth = this.model.maxGrowth();
            this.xScale.range([0, chartRect.width]);
            this.yScale
                .domain([0, maxGrowth].sort())
                .range([chartRect.height, 0]);

            const line = d3.line()
                .x((d, i) => this.xScale(i))
                .y((d) => this.yScale(d))
                .curve(d3.curveNatural);

            const pathData = data.timePoints[data.index].map((point) => point * growth);

            this.path
                .datum(pathData)
                .attr('d', line);
        }
    }

    createContainers() {
        this.title = this.container
          .append('div')
            .attr('id', 'tooltip-title');

        const rowContainer = this.container
          .append('div')
            .attr('id', 'tooltip-row-container');

        const valueContainer = rowContainer
          .append('div')
            .attr('id', 'tooltip-value-container');

        this.value = valueContainer
          .append('div')
            .attr('id', 'tooltip-value');

        this.growth = valueContainer
          .append('div')
            .attr('id', 'tooltip-growth');

        this.chart = rowContainer
          .append('svg')
            .attr('id', 'tooltip-chart');
    }
}
