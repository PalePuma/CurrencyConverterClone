// David Christophel
// March 2020

function Model(base, tgt) {
  this.recalculate = () => {};
  // initialize base value & base currency
  this.base = Object.create(null, {
    cur: {
      get: ( ) => this._bcur,
      set: (v) => {
        this._bcur = v;
        this.recalculate('base', this.base.val);
      }}
  });
  this.base.val = base[0];
  this.base.cur = base[1];

  // initialize target value & target currency
  this.tgt = Object.create(null, {
    cur: {
      get: ( ) => this._tcur,
      set: (v) => {
        this._tcur = v;
        this.recalculate('base', this.base.val);
      }}
  });
  this.tgt.val = tgt[0];
  this.tgt.cur = tgt[1];

  // model.recalculate() :
  //     calculate currency conversions & update model accordingly
  this.recalculate = (source, value) => {
    if (source === 'base') {
      this.base.val = parseFloat(value);
      this.tgt.val = fx.convert(
        value, { from: this.base.cur, to: this.tgt.cur }
      );
    } else {
      this.tgt.val = parseFloat(value);
      this.base.val = fx.convert(
        value, { from: this.tgt.cur, to: this.base.cur }
      );
    }
  };
}
