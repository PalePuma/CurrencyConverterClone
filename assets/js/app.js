// David Christophel
// March 2020

function View(app, date, base, tgt) {
  this.base = {
    qty: base[0],
    label: base[1],
    number: base[2],
    menu: base[3]
  };
  this.tgt = {
    qty: tgt[0],
    label: tgt[1],
    number: tgt[2],
    menu: tgt[3]
  };
  // render date label
  document.getElementById('date').textContent = date;

  // the view listens for change events from any UI contorls
  this.base.number.addEventListener('change', this, false);
  this.base.menu.addEventListener('change', this, false);
  this.tgt.number.addEventListener('change', this, false);
  this.tgt.menu.addEventListener('change', this, false);
  // the view delegates all event handling to app.change()
  this.handleEvent = (e) => app.change(
    e.target.type, e.target.className, e.target.value);
}

function App(dataDate) {
  // view & model instantiation
  this.view = new View(
    this,
    dataDate,
    document.getElementsByClassName('base'),
    document.getElementsByClassName('tgt'),
  );
  this.model = new Model(
    [parseFloat(this.view.base.number.value), this.view.base.menu.value],
    [null, this.view.tgt.menu.value]);

  // app.updateView() :
  //     redraw every UI element using current model values
  this.updateView = () => {
    // base price elements
    this.view.base.qty.textContent = accounting.toFixed(this.model.base.val, 2);
    let i = this.view.base.menu.options.selectedIndex;
    this.view.base.label.textContent = this.view.base.menu.options[i].textContent;
    this.view.base.number.value = accounting.toFixed(this.model.base.val, 2);
    // target price elements
    this.view.tgt.qty.textContent = accounting.toFixed(this.model.tgt.val, 2);
    i = this.view.tgt.menu.options.selectedIndex;
    this.view.tgt.label.textContent = this.view.tgt.menu.options[i].textContent;
    this.view.tgt.number.value = accounting.toFixed(this.model.tgt.val, 2);
  }

  // app.change() :
  //     respond whenever a price value or currency type changes
  this.change = (type, className, value) => {
    if (type === 'number') {
      this.model.recalculate(className, value);
    } else if (className === 'base') {
      this.model.base.cur = value;
    } else {
      this.model.tgt.cur = value;
    };
    // every 'change' event requires the view to be redrawn
    this.updateView();
  }
  // this 'change' event triggers all initial calculations &
  // ensures that every UI element is rendered at the start
  this.view.base.number.dispatchEvent(new Event('change'));
}

fetch('https://api.exchangeratesapi.io/latest?base=USD')
  .then((response) => response.json())
  .then((data) => {
    // Check money.js has finished loading
    if (typeof fx !== 'undefined' && fx.rates) {
      fx.base = data.base;
      fx.rates = data.rates;
    } else {
      // Not finished loading
      var fxSetup = {
        rates: data.rates,
        base: data.base
      }
    }
    return data.date;
  })
  // app begins here by calling the App constructor
  .then((date) => new App(date));
