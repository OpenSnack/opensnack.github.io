import * as d3 from 'd3';

import {MultiChartView} from './MultiChartView';
import {TableView} from './TableView';
import {BarChartView} from './BarChartView';
import {MapView} from './MapView';
import {SliderView} from './SliderView';

export class MagicView {
    constructor(model, container) {
        this.model = model;
        this.container = container;
        this.caption = this.container.select('#caption');

        this._svgSizeMult = 5;
        const mult = this._svgSizeMult;

        const tableSVG = this.viewify(this.container.append('svg').attr('id', 'magic-svg-1'));
        this.tableView = new TableView(model, tableSVG, this);

        const barChartSVG = this.viewify(this.container.append('svg').attr('id', 'magic-svg-2'));
        this.barChartView = new BarChartView(model, barChartSVG, this, {'maskID': this.tableView.textMaskID});

        const mapMultiSVG = this.viewify(this.container.append('svg').attr('id', 'magic-svg-3'));
        this.mapView = new MapView(model, mapMultiSVG, this);
        this.multiChartView = new MultiChartView(model, mapMultiSVG, this);

        const sliderDiv = this.viewify(this.container.append('div').attr('id', 'slider'));
        this.sliderView = new SliderView(model, sliderDiv);

        this.views = [
            this.tableView,
            this.barChartView,
            this.mapView,
            this.multiChartView,
            this.sliderView
        ];
    }

    init() {
        this.model.addObserver(this);
        this.container.style('height', window.innerHeight * this._svgSizeMult + 'px');
        this.views.forEach((view) => {
            view.setHeight(window.innerHeight);
            view.init();
        });

        window.addEventListener('resize', () => this.update({trigger: 'resize'}));
        window.addEventListener('scroll', () => this.update({trigger: 'scroll'}));
        return this;
    }

    update(params) {
        this.views.forEach((view) => {
            view.setHeight(window.innerHeight);
            view.update(params);
        });
    }

    viewify(selection) {
        // adds some extras to a D3 SVG selection
        selection.width = function() {
            return this.node().clientWidth;
        };

        selection.height = function() {
            return this.node().clientHeight;
        };

        return selection;
    }
}
