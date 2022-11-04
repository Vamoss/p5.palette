/**
 * Color palette
 */
class Palette {
  constructor(P, colors) {
    this.P = P;
    this.colors = colors || [];
    this.index = 0;
  }

  add(color) {
    this.colors.push(color);
  }

  addAnalogousColors() {
    const analogous = this.getAnalogous();
    const newColors = [];
    for (let i = 0; i < this.size(); i++) {
      newColors.push(analogous.get(i * 2));
      newColors.push(this.get(i));
      newColors.push(analogous.get(i * 2 + 1));
    }
    this.colors = Array.from(newColors);
  }

  addComplementaryColors() {
    const complementary = this.getComplementary();
    const newColors = [];
    for (let i = 0; i < this.size(); i++) {
      newColors.push(this.get(i));
      newColors.push(complementary.get(i));
    }
    this.colors = Array.from(newColors);
  }

  addSplitComplementaryColors() {
    const complementary = this.getSplitComplementary();
    const newColors = [];
    for (let i = 0; i < this.size(); i++) {
      newColors.push(complementary.get(i * 2));
      newColors.push(this.get(i));
      newColors.push(complementary.get(i * 2 + 1));
    }
    this.colors = Array.from(newColors);
  }

  addTriadicColors() {
    const triadic = this.getTriadic();
    const newColors = [];
    for (let i = 0; i < this.size(); i++) {
      newColors.push(triadic.get(i * 2));
      newColors.push(this.get(i));
      newColors.push(triadic.get(i * 2 + 1));
    }
    this.colors = Array.from(newColors);
  }  

  getAnalogous() {
    const newColors = [];
    this.colors.forEach((col) => {
      const [a1, a2] = this.#getAnalogous(col);
      newColors.push(a1);
      newColors.push(a2);
    });
    return new Palette(this.P, newColors);
  }

  getComplementary() {
    const newColors = [];
    this.colors.forEach((col) => {
      newColors.push(this.#getComplementary(col));
    });
    return new Palette(this.P, newColors);
  }

  getSplitComplementary() {
    const newColors = [];
    this.colors.forEach((col) => {
      const [s1, s2] = this.#getSplitComplementary(col);
      newColors.push(s1);
      newColors.push(s2);
    });
    return new Palette(this.P, newColors);
  }

  getTriadic() {
    const newColors = [];
    this.colors.forEach((col) => {
      const [t1, t2] = this.#getTriadic(col);
      newColors.push(t1);
      newColors.push(t2);
    });
    return new Palette(this.P, newColors);
  }

  clone() {
    const newPalette = this.P.createPalette(this.colors);
    return newPalette;
  }

  current() {
    return this.colors[this.index];
  }

  darken() {
    this.P.push();
    this.P.colorMode(HSB);
    const newColors = [];
    for (let i = 0; i < this.size(); i++) {
      const col = this.get(i);
      newColors.push(this.P.color(this.P.hue(col), this.P.saturation(col), this.P.brightness(col) * 0.9));
    }
    this.colors = Array.from(newColors);
    this.P.pop();
  }

  draw(args) {
    const { x = 0, y = 0, width = 100, height = 50, showIndex = false, drawBorder = false, borderColor = 0, borderWeight = 1 } = args;
    this.P.push();
    this.P.noStroke();
    let xx = x;
    let total = this.colors.length;
    const sliceWidth = width / total;
    for (let i = 0; i < total; i++) {
      this.P.fill(this.colors[i]);
      if (i === this.index && showIndex) {
        const sliceHeight = height / 5;
        this.P.rect(xx, y + sliceHeight, sliceWidth, 3 * sliceHeight);
      } else {
        this.P.rect(xx, y, sliceWidth, height);
      }
      xx += sliceWidth;
    }
    if (drawBorder) {
      this.P.noFill();
      this.P.stroke(borderColor);
      this.P.strokeWeight(borderWeight);
      this.P.rect(x, y, width, height);
    }
    this.P.pop();
  }

  get(ix) {
    if (ix) return this.colors[ix];
    return this.colors[this.index];
  }

  lighten() {
    this.P.push();
    this.P.colorMode(HSB);
    const newColors = [];
    for (let i = 0; i < this.size(); i++) {
      const col = this.get(i);
      newColors.push(this.P.color(this.P.hue(col), this.P.saturation(col) * 0.9, this.P.brightness(col) * 1.1));
    }
    this.colors = Array.from(newColors);
    this.P.pop();
  }

  log() {
    this.colors.forEach((col) => {
      const value = col.toString("#rrggbb");
      const style = `background: #222; color: ${value}`;
      console.log(`%c%s%c %s`, style, "■■■■■■■■■■■■■■■■■■■■", "color:gray", `${value}`);
    });
  }

  next() {
    if (++this.index === this.colors.length) {
      this.index = 0;
    }
    return this.colors[this.index];
  }

  previous() {
    if (--this.index < 0) {
      this.index = this.colors.length - 1;
    }
    return this.colors[this.index];
  }

  reset() {
    this.index = 0;
  }

  reverse() {
    this.colors.reverse();
  }

  size() {
    return this.colors.length;
  }

  shuffle(func) {
    const rnd = func || Math.random;
    this.colors = this.colors.sort(() => rnd() - 0.5);
  }

  sortByBrightness() {
    this.colors = this.colors.sort((a, b) => {
      return this.P.brightness(a) === this.P.brightness(b) ? 0 : this.P.brightness(a) > this.P.brightness(b) ? 1 : -1;
    });
  }

  sortByLightness() {
    this.colors = this.colors.sort((a, b) => {
      return this.P.lightness(a) === this.P.lightness(b) ? 0 : this.P.lightness(a) > this.P.lightness(b) ? 1 : -1;
    });
  }

  sortBySaturation() {
    this.colors = this.colors.sort((a, b) => {
      return this.P.saturation(a) === this.P.saturation(b) ? 0 : this.P.saturation(a) > this.P.saturation(b) ? 1 : -1;
    });
  }

  toHexString() {
    return this.toString().replaceAll("#", "");
  }

  toString(args) {
    const separator = (args && args.separator) || "-";
    const format = (args && args.format) || "#rrggbb";
    let str = "";
    this.colors.forEach((color) => {
      str += color.toString(format);
      str += separator;
    });
    str = str.slice(0, -1);
    return str;
  }

  #getAnalogous(col) {
    this.P.push();
    this.P.colorMode(HSB);
    const a1 = this.P.color((this.P.hue(col) + 330) % 360, this.P.saturation(col), this.P.brightness(col));
    const a2 = this.P.color((this.P.hue(col) + 30) % 360, this.P.saturation(col), this.P.brightness(col));
    this.P.pop();
    return [a1, a2];
  }

  #getComplementary(col) {
    this.P.push();
    this.P.colorMode(HSB);
    const complementary = this.P.color((this.P.hue(col) + 180) % 360, this.P.saturation(col), this.P.brightness(col));
    this.P.pop();
    return complementary;
  }

  #getSplitComplementary(col) {
    this.P.push();
    this.P.colorMode(HSB);
    const s1 = this.P.color((this.P.hue(col) + 150) % 360, this.P.saturation(col), this.P.brightness(col));
    const s2 = this.P.color((this.P.hue(col) + 210) % 360, this.P.saturation(col), this.P.brightness(col));
    this.P.pop();
    return [s1, s2];
  }

  #getTetradic(col) {

  }

  #getTriadic(col) {
    this.P.push();
    this.P.colorMode(HSB);
    const t1 = this.P.color((this.P.hue(col) + 120) % 360, this.P.saturation(col), this.P.brightness(col));
    const t2 = this.P.color((this.P.hue(col) + 240) % 360, this.P.saturation(col), this.P.brightness(col));
    this.P.pop();
    return [t1, t2];
  }
}
