/* Protótipo App Nutri — dados fictícios. Imagens e modelos dos alimentos gerados no Blender (assets/). */
(function () {
'use strict';
const { html, render, useState, useEffect, useMemo, useRef } = htmPreact;
const A = p => 'assets/' + p;
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
const fmt = (n, d = 0) => Number(n).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
const RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ alimentos (por 100 g; d = g/ml; ref = gramas que o render representa) */
const F = {
  arroz: { n: 'Arroz branco cozido', kcal: 128, p: 2.5, c: 28.1, f: .2, fib: 1.6, d: .8, g: 'carb', ref: 140, m: { 'colher de servir': 45, 'escumadeira': 90 }, def: ['colher de servir', 3], syn: ['arroz', 'arros', 'arroz branco'], marm: 1, price: 1.2 },
  integral: { n: 'Arroz integral cozido', kcal: 124, p: 2.6, c: 25.8, f: 1, fib: 2.7, d: .8, g: 'carb', ref: 140, m: { 'colher de servir': 45 }, def: ['colher de servir', 3], syn: ['arroz integral', 'integral'], marm: 1, price: 1.6 },
  feijao: { n: 'Feijão carioca cozido', kcal: 76, p: 4.8, c: 13.6, f: .5, fib: 8.5, d: 1.0, g: 'leg', ref: 110, m: { 'concha média': 100 }, def: ['concha média', 1], syn: ['feijao', 'feijão', 'feijao carioca', 'fejao'], marm: 1, price: 1.0 },
  feijaopreto: { n: 'Feijão preto cozido', kcal: 77, p: 4.5, c: 14, f: .5, fib: 8.4, d: 1.0, g: 'leg', ref: 110, m: { 'concha média': 100 }, def: ['concha média', 1], syn: ['feijao preto', 'feijão preto'], marm: 1, price: 1.1 },
  lentilha: { n: 'Lentilha cozida', kcal: 93, p: 6.3, c: 16.3, f: .5, fib: 7.9, d: .95, g: 'leg', ref: 110, m: { 'concha média': 100 }, def: ['concha média', 1], syn: ['lentilha'], marm: 1, price: 1.8 },
  graodebico: { n: 'Grão-de-bico cozido', kcal: 130, p: 8.4, c: 21, f: 2.1, fib: 5.1, d: .75, g: 'leg', ref: 110, m: { 'colher de servir': 50 }, def: ['colher de servir', 2], syn: ['grao de bico', 'grão-de-bico', 'grao'], marm: 1, price: 2.0 },
  frango: { n: 'Peito de frango grelhado', kcal: 159, p: 32, c: 0, f: 2.5, fib: 0, d: .9, g: 'prot', ref: 130, m: { 'filé médio': 120 }, def: ['filé médio', 1], syn: ['frango', 'file de frango', 'peito de frango', 'frango grelhado'], marm: 1, price: 3.5 },
  patinho: { n: 'Patinho grelhado', kcal: 219, p: 35.9, c: 0, f: 7.3, fib: 0, d: .95, g: 'prot', ref: 150, m: { 'bife médio': 75 }, def: ['bife médio', 1], syn: ['patinho', 'bife', 'carne', 'carne vermelha', 'bife acebolado'], marm: 1, price: 5.5 },
  tilapia: { n: 'Filé de tilápia grelhado', kcal: 128, p: 26, c: 0, f: 2.7, fib: 0, d: .9, g: 'prot', ref: 120, m: { 'filé médio': 120 }, def: ['filé médio', 1], syn: ['tilapia', 'tilápia', 'peixe', 'file de peixe'], marm: 1, price: 5.0 },
  guisado: { n: 'Carne moída refogada (guisado)', kcal: 212, p: 26.7, c: 0, f: 10.9, fib: 0, d: .85, g: 'prot', ref: 110, m: { 'colher de servir': 50 }, def: ['colher de servir', 2], syn: ['guisado', 'carne moida', 'carne moída', 'moida'], marm: 1, price: 4.2 },
  ovo: { n: 'Ovo cozido', kcal: 146, p: 13.3, c: .6, f: 9.5, fib: 0, d: .95, g: 'prot', ref: 100, m: { 'unidade': 50 }, def: ['unidade', 2], syn: ['ovo', 'ovos', 'ovo cozido'], marm: 1, price: .9 },
  batatadoce: { n: 'Batata-doce cozida', kcal: 77, p: .6, c: 18.4, f: .1, fib: 2.2, d: .65, g: 'carb', ref: 150, m: { 'colher de servir': 50 }, def: ['colher de servir', 3], syn: ['batata doce', 'batata-doce', 'batatadoce'], marm: 1, price: .8 },
  batata: { n: 'Batata inglesa cozida', kcal: 52, p: 1.2, c: 11.9, f: 0, fib: 1.3, d: .7, g: 'carb', ref: 150, m: { 'colher de servir': 50 }, def: ['colher de servir', 3], syn: ['batata', 'batata inglesa'], marm: 1, price: .7 },
  aipim: { n: 'Mandioca cozida (aipim)', kcal: 125, p: .6, c: 30.1, f: .3, fib: 1.6, d: .7, g: 'carb', ref: 130, m: { 'pedaço médio': 60 }, def: ['pedaço médio', 2], syn: ['aipim', 'mandioca', 'macaxeira'], marm: 1, price: .8 },
  macarrao: { n: 'Macarrão penne cozido', kcal: 102, p: 3.4, c: 19.9, f: 1.2, fib: 1.2, d: .6, g: 'carb', ref: 130, m: { 'pegador': 110 }, def: ['pegador', 1], syn: ['macarrao', 'massa', 'penne', 'espaguete'], marm: 1, price: .9 },
  salada: { n: 'Salada de folhas', kcal: 11, p: 1.3, c: 1.7, f: .2, fib: 1.8, d: .15, g: 'veg', ref: 50, m: { 'prato de sobremesa': 30 }, def: ['prato de sobremesa', 2], syn: ['salada', 'alface', 'folhas', 'rucula'], marm: 0, price: .6 },
  tomate: { n: 'Tomate em rodelas', kcal: 15, p: 1.1, c: 3.1, f: .2, fib: 1.2, d: .6, g: 'veg', ref: 80, m: { 'rodela': 15 }, def: ['rodela', 4], syn: ['tomate'], marm: 1, price: .6 },
  brocolis: { n: 'Brócolis cozido', kcal: 25, p: 2.1, c: 4.4, f: .5, fib: 3.4, d: .35, g: 'veg', ref: 80, m: { 'ramo': 20 }, def: ['ramo', 4], syn: ['brocolis', 'brócolis'], marm: 1, price: 1.4 },
  cenoura: { n: 'Cenoura cozida', kcal: 30, p: .8, c: 6.7, f: .2, fib: 2.6, d: .6, g: 'veg', ref: 50, m: { 'colher de sopa': 25 }, def: ['colher de sopa', 3], syn: ['cenoura'], marm: 1, price: .5 },
  abobrinha: { n: 'Abobrinha refogada', kcal: 20, p: 1.1, c: 3, f: .6, fib: 1.4, d: .55, g: 'veg', ref: 80, m: { 'colher de sopa': 30 }, def: ['colher de sopa', 3], syn: ['abobrinha'], marm: 1, price: .6 },
  pao: { n: 'Pão francês (cacetinho)', kcal: 300, p: 8, c: 58.6, f: 3.1, fib: 2.3, d: .25, g: 'carb', ref: 50, m: { 'unidade': 50 }, def: ['unidade', 1], syn: ['pao', 'pão', 'cacetinho', 'cacetinhos', 'pao frances', 'paozinho'], marm: 0, price: .8 },
  banana: { n: 'Banana-prata', kcal: 98, p: 1.3, c: 26, f: .1, fib: 2, d: .9, g: 'fruta', ref: 70, m: { 'unidade': 70 }, def: ['unidade', 1], syn: ['banana', 'bananas'], marm: 0, price: .4 },
  bergamota: { n: 'Bergamota (tangerina)', kcal: 38, p: .7, c: 9.6, f: .1, fib: .9, d: .9, g: 'fruta', ref: 135, m: { 'unidade': 135 }, def: ['unidade', 1], syn: ['bergamota', 'bergamotas', 'tangerina', 'mexerica', 'mimosa'], marm: 0, price: .5 },
  iogurte: { n: 'Iogurte natural', kcal: 51, p: 4.1, c: 1.9, f: 3, fib: 0, d: 1.03, g: 'lat', ref: 170, m: { 'pote': 170 }, def: ['pote', 1], syn: ['iogurte', 'yogurte'], marm: 0, price: 2.5 },
  aveia: { n: 'Aveia em flocos', kcal: 394, p: 13.9, c: 66.6, f: 8.5, fib: 9.1, d: .4, g: 'carb', ref: 30, m: { 'colher de sopa': 15 }, def: ['colher de sopa', 2], syn: ['aveia'], marm: 0, price: .7 },
  azeite: { n: 'Azeite de oliva', kcal: 884, p: 0, c: 0, f: 100, fib: 0, d: .92, g: 'gord', ref: 4, m: { 'colher de chá': 4 }, def: ['colher de chá', 1], syn: ['azeite', 'oleo'], marm: 0, price: .4, noimg: 1 },
};
const NOFILL = { pao: 1, banana: 1, bergamota: 1, iogurte: 1, aveia: 1, azeite: 1, salada: 1 };
const GRP = { carb: 'Carboidrato', prot: 'Proteína', leg: 'Leguminosa', veg: 'Vegetais', fruta: 'Fruta', lat: 'Laticínio', gord: 'Gordura' };
const short = k => F[k].n.split(' (')[0];
const shortN = k => short(k).replace(/ (cozid[oa]|grelhad[oa]|refogad[oa]|em rodelas|em flocos)$/, '');
let uid = 1; const it = (k, g) => ({ id: uid++, k, g });
const nut = i => { const f = F[i.k], r = i.g / 100; return { kcal: f.kcal * r, p: f.p * r, c: f.c * r, f: f.f * r, fib: f.fib * r, ml: i.g / f.d }; };
const sum = L => L.reduce((a, i) => { const n = nut(i); for (const k in a) a[k] += n[k]; return a; }, { kcal: 0, p: 0, c: 0, f: 0, fib: 0, ml: 0 });
const plural = m => { const w = m.split(' '); w[0] = w[0].endsWith('r') ? w[0] + 'es' : w[0].endsWith('ão') ? w[0].slice(0, -2) + 'ões' : w[0] + 's'; if (w[1] && /^(médi[oa])$/.test(w[1])) w[1] += 's'; return w.join(' '); };
function measure(i) { const f = F[i.k]; for (const [m, g] of Object.entries(f.m)) { const q = i.g / g; const qq = Math.round(q * 2) / 2; if (Math.abs(q - qq) < .06 && qq >= .5 && qq <= 8) return `${String(qq).replace('.', ',')} ${qq > 1 ? plural(m) : m}`; } return ''; }
function subs(i) { const f = F[i.k], kc = nut(i).kcal; return Object.entries(F).filter(([k, o]) => k !== i.k && o.g === f.g && !o.noimg).map(([k, o]) => ({ k, g: Math.max(5, Math.round(kc / o.kcal * 100 / 5) * 5) })).filter(s => s.g <= 400).slice(0, 3); }

/* parser do campo "adicionar alimento" */
function lev(a, b) { const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i]); for (let j = 1; j <= n; j++) d[0][j] = j; for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[m][n]; }
function rankFoods(t) {
  t = norm(t).replace(/\b(de|do|da|com)\b/g, ' ').replace(/\s+/g, ' ').trim(); if (!t) return [];
  const out = [];
  for (const [k, f] of Object.entries(F)) {
    let bs = 1e9;
    for (const s of [...f.syn, f.n].map(norm)) {
      let sc; if (t === s) sc = 0; else if (s.startsWith(t)) sc = 1 + (s.length - t.length) * .01; else if (s.includes(t) && t.length > 2) sc = 2; else if (t.includes(s)) sc = 1.5;
      else { const dd = lev(t, s.slice(0, Math.max(t.length, 3))); sc = dd <= Math.max(1, Math.floor(t.length / 4)) ? 3 + dd : 1e9; }
      bs = Math.min(bs, sc);
    }
    if (bs < 1e9) out.push([bs, k]);
  }
  return out.sort((a, b) => a[0] - b[0]).map(x => x[1]);
}
const UNITS = { concha: 'concha', conchas: 'concha', colher: 'colher', colheres: 'colher', escumadeira: 'escumadeira', unidade: 'unidade', unidades: 'unidade', un: 'unidade', file: 'filé', pote: 'pote', fatia: 'fatia', rodela: 'rodela', rodelas: 'rodela', pedaco: 'pedaço', pedacos: 'pedaço', ramo: 'ramo', ramos: 'ramo', bife: 'bife', pegador: 'pegador' };
function parse(raw, forceK) {
  let t = norm(raw); if (!t) return null; let qty = null, unit = null, grams = null;
  t = t.replace(/^(meia|meio)\s+/, '0.5 ').replace(/^uma?\s+/, '1 ').replace(/^(dois|duas)\s+/, '2 ').replace(/^tres\s+/, '3 ');
  const mg = t.match(/^(\d+(?:[.,]\d+)?)\s*(g|gr|gramas?)\b\s*(?:de\s+)?(.*)$/);
  if (mg) { grams = parseFloat(mg[1].replace(',', '.')); t = mg[3]; }
  else {
    const mq = t.match(/^(\d+(?:[.,]\d+)?)\s+(.*)$/); if (mq) { qty = parseFloat(mq[1].replace(',', '.')); t = mq[2]; }
    const mu = t.match(/^(\w+)(?:\s+(?:de\s+)?(sopa|cha|servir))?\s+(?:de\s+)?(.*)$/); if (mu && UNITS[mu[1]]) { unit = UNITS[mu[1]]; t = mu[3]; }
  }
  const k = forceK || rankFoods(t)[0]; if (!k) return { err: `Nenhum alimento encontrado para “${raw.trim()}”` };
  const f = F[k];
  if (grams == null) {
    if (unit) { const key = Object.keys(f.m).find(m => norm(m).startsWith(norm(unit))); grams = (key ? f.m[key] : f.m[f.def[0]]) * (qty || 1); }
    else if (qty != null && qty >= 10) grams = qty;
    else grams = f.m[f.def[0]] * (qty || f.def[1]);
  }
  return { k, g: Math.round(grams) };
}

/* ------------------------------------------------------------------ dados fictícios */
const T = { kcal: 1800, p: 110, c: 200, f: 60 };
const MEALS = [['cafe', 'Café da manhã', '07:30'], ['almoco', 'Almoço', '12:30'], ['lanche', 'Lanche da tarde', '16:00'], ['jantar', 'Jantar', '20:00']];
const planTemplate = () => ({
  cafe: [it('pao', 50), it('ovo', 100), it('banana', 70)],
  almoco: [it('salada', 60), it('arroz', 135), it('feijao', 100), it('frango', 120), it('cenoura', 75)],
  lanche: [it('iogurte', 170), it('aveia', 30), it('bergamota', 135)],
  jantar: [it('batatadoce', 150), it('guisado', 100), it('brocolis', 80)],
});
const TPL = planTemplate(); const sig = L => L.map(i => i.k + ':' + i.g).sort().join('|');
const heroFor = (meal, L) => (TPL[meal] && sig(TPL[meal]) === sig(L)) ? meal : null;
const Hero = ({ meal, alt }) => html`<img class="hero" src=${A(meal + '_hero.webp')} alt=${alt || 'Prato renderizado'} />`;
const clone = p => Object.fromEntries(Object.entries(p).map(([m, L]) => [m, L.map(i => ({ ...i }))]));
function seeded(s) { return () => (s = (s * 16807) % 2147483647) / 2147483647; }
const PATIENTS = [
  { id: 'ana', n: 'Ana Ribeiro', age: 34, goal: 'Emagrecimento', next: 'Ter 10/11 · 14:00', adh: 84, last: 'hoje, 07:42', w0: 78.4, w1: 74.9, h: 1.66, flag: null },
  { id: 'bruno', n: 'Bruno Costa', age: 41, goal: 'Hipertensão', next: 'Qui 12/11 · 09:00', adh: null, last: 'há 4 dias', w0: 92.1, w1: 90.6, h: 1.78, flag: ['bad', 'Sem registro há 4 dias'] },
  { id: 'carla', n: 'Carla Menezes', age: 29, goal: 'SOP', next: 'Seg 16/11 · 10:30', adh: 41, last: 'ontem, 21:10', w0: 70.2, w1: 69.8, h: 1.62, flag: ['bad', 'Jantar fora do plano em 5 dos últimos 7 dias'] },
  { id: 'fabio', n: 'Fábio Lima', age: 52, goal: 'Uso de GLP-1', next: 'Qua 11/11 · 16:00', adh: 76, last: 'hoje, 08:15', w0: 104.5, w1: 96.2, h: 1.80, flag: ['warn', 'Proteína abaixo da meta há 3 dias'] },
  { id: 'elisa', n: 'Elisa Prado', age: 38, goal: 'Gestação · 24 semanas', next: 'sem horário', adh: 69, last: 'ontem, 19:30', w0: 63.0, w1: 66.4, h: 1.64, flag: ['warn', 'Retorno vencido há 12 dias'] },
  { id: 'diego', n: 'Diego Souza', age: 25, goal: 'Hipertrofia', next: 'Sex 13/11 · 18:00', adh: 88, last: 'hoje, 06:50', w0: 71.0, w1: 73.4, h: 1.76, flag: ['info', 'Mensagem sem resposta há 2 h'] },
  { id: 'gustavo', n: 'Gustavo Teixeira', age: 60, goal: 'Diabetes tipo 2', next: 'Ter 17/11 · 08:30', adh: 72, last: 'hoje, 07:05', w0: 88.3, w1: 85.9, h: 1.72, flag: null },
  { id: 'helena', n: 'Helena Rocha', age: 45, goal: 'Menopausa', next: 'Seg 23/11 · 11:00', adh: 91, last: 'hoje, 09:02', w0: 68.9, w1: 67.1, h: 1.60, flag: null },
  { id: 'igor', n: 'Igor Matos', age: 33, goal: 'Emagrecimento', next: 'Qui 19/11 · 17:30', adh: 66, last: 'ontem, 13:20', w0: 96.0, w1: 93.1, h: 1.83, flag: null },
  { id: 'julia', n: 'Júlia Farias', age: 22, goal: 'Vegetariana · performance', next: 'Sex 20/11 · 15:00', adh: 88, last: 'hoje, 08:40', w0: 58.2, w1: 58.9, h: 1.67, flag: null },
];
const initials = n => n.split(' ').map(x => x[0]).slice(0, 2).join('');
function weightSeries(p) { const r = seeded(p.id.length * 999 + p.w0 * 10); const out = []; for (let i = 0; i < 12; i++) { const t = i / 11; out.push(+(p.w0 + (p.w1 - p.w0) * (t * .85 + .15 * Math.sin(t * 3)) + (r() - .5) * .5).toFixed(1)); } out[11] = p.w1; return out; }
function histOf(p) { const r = seeded(p.id.charCodeAt(0) * 131 + 7); const base = (p.adh || 50) / 100; const D = []; for (let d = 0; d < 27; d++) { D.push(MEALS.map((_, m) => { const x = r(); const pb = base - (m === 3 ? .12 : 0); return x < pb ? 'ok' : x < pb + (1 - pb) * .65 ? 'dif' : 'pul'; })); } return D; }

const S = {
  mode: 'nutri', page: 'hoje', pid: 'ana', ptab: 'resumo', meal: 'almoco', pm: false,
  plans: {}, pub: {}, ver: {}, hist: {}, today: {}, obst: { ana: { 'Fome à noite': 2, 'Trabalho': 1 } }, swaps: { ana: 0 }, events: [],
  marm: { pot: 750, div: 3, sel: 0, comps: [[it('arroz', 135), it('feijao', 100)], [it('frango', 120)], [it('cenoura', 80)]] },
  papp: { tab: 'hoje', sheet: null }, toast: null, modal: null,
  msgs: {
    diego: [['in', 'Oi! Posso trocar o ovo do café por whey nos dias de treino?', '10:12']],
    ana: [['in', 'Sábado tem aniversário da minha sobrinha. Como faço com o jantar?', 'ontem'], ['out', 'Escolhe uma fatia de bolo e mantém a proteína do jantar. Na segunda volta normal!', 'ontem']],
    carla: [['in', 'Essa semana foi difícil, trabalhei até tarde todo dia.', 'ontem']],
  },
  unread: { diego: 1, carla: 1 },
};
PATIENTS.forEach(p => { S.plans[p.id] = planTemplate(); S.pub[p.id] = clone(S.plans[p.id]); S.ver[p.id] = p.id === 'ana' ? 4 : 2; S.hist[p.id] = histOf(p); S.today[p.id] = ['ok', null, null, null]; S.obst[p.id] = S.obst[p.id] || {}; S.swaps[p.id] = 0; });
const listeners = new Set();
const set = fn => { fn(S); listeners.forEach(l => l()); };
function useStore() { const [, f] = useState(0); useEffect(() => { const l = () => f(x => x + 1); listeners.add(l); return () => listeners.delete(l); }, []); return S; }
let toastT; const toast = t => { set(s => { s.toast = t; }); clearTimeout(toastT); toastT = setTimeout(() => set(s => { s.toast = null; }), 2600); };
const pat = id => PATIENTS.find(p => p.id === id);
function adherence(id) { const H = S.hist[id].slice(-6).flat().concat(S.today[id].filter(Boolean)); return Math.round(H.filter(x => x === 'ok').length / H.length * 100); }

/* ------------------------------------------------------------------ ícones */
const P = {
  hoje: 'M3 11.5 12 4l9 7.5M5.5 9.5V20h13V9.5', agenda: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4', pacientes: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.8-3.4 3.4-5 6.5-5s5.7 1.6 6.5 5M16 4.5a3.2 3.2 0 0 1 0 6.2M18 15c2 .6 3.2 2.3 3.6 5',
  mensagens: 'M4 5h16v11H9l-5 4z', alimentos: 'M6 3v8a3 3 0 0 0 6 0V3M9 3v18M17 3c-2 2-2.5 5-2.5 8H18V21',
  plano: 'M5 4h14v16H5zM9 9h6M9 13h6M9 17h3', marmita: 'M3.5 8h17v10a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2zM12 8v12M12 14h8.5M2.5 6h19',
  progresso: 'M4 19h16M6 16l4-5 3 3 5-7', cube: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12 4 7.5', plus: 'M12 5v14M5 12h14', x: 'M6 6l12 12M18 6 6 18',
  check: 'M5 12.5l4.5 4.5L19 7.5', search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4', swap: 'M7 7h12l-3-3M17 17H5l3 3', present: 'M3 5h18v11H3zM8 21h8M12 16v5',
  camera: 'M4 8h3.5L9 6h6l1.5 2H20v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z', chev: 'M9 6l6 6-6 6', back: 'M15 6l-6 6 6 6', send: 'M4 12 20 4l-6 16-3-7z',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4', moon: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z',
  play: 'M8 5.5v13l10-6.5z', pause: 'M8 5v14M16 5v14',
  bell: 'M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15zM10 20h4', cart: 'M3 4h2.5l2 11h11l2-8H7M9 20a1 1 0 1 0 0-.1M18 20a1 1 0 1 0 0-.1',
};
const Icon = ({ n, s = 18, w = 1.7 }) => html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=${w} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d=${P[n]} /></svg>`;
const Mark = ({ s = 28, bg = 'var(--lime)', fg = 'var(--lime-ink)' }) => html`<svg width=${s} height=${s} viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15" fill=${bg}/><circle cx="16" cy="16" r="9.5" fill="none" stroke=${fg} stroke-width="2.6"/><path d="M16 6.5v19M16 16H6.5" stroke=${fg} stroke-width="2.6" stroke-linecap="round"/></svg>`;
const Logo = ({ s = 28, color }) => html`<span class="brand" style=${color ? `color:${color}` : ''}><${Mark} s=${s} /><span class="wm">nutri</span></span>`;
const Pill = ({ k, children }) => html`<span class=${'pill ' + (k || '')}>${children}</span>`;
const Thumb = ({ k, s = 40 }) => F[k].noimg ? html`<div class="thumb" style=${`width:${s}px;height:${s}px`}><span class="tiny mut">${short(k).slice(0, 2)}</span></div>`
  : html`<div class="thumb" style=${`width:${s}px;height:${s}px`}><img src=${A(k + '_mound.webp')} alt="" loading="lazy" /></div>`;

/* ------------------------------------------------------------------ prato (composição dos renders do Blender) */
const ORDER = { veg: 0, carb: 1, leg: 2, fruta: 3, lat: 4, prot: 5, gord: 6 };
const SLOTS = { veg: [[.64, .40], [.64, .62], [.54, .30]], carb: [[.38, .36], [.42, .66], [.54, .32]], leg: [[.34, .57], [.45, .68]], prot: [[.53, .63], [.56, .38], [.46, .5]], fruta: [[.63, .38], [.63, .62]], lat: [[.4, .42]], gord: [[.5, .5]] };
const SPARE = [[.5, .5], [.42, .38], [.6, .6], [.38, .62], [.62, .4]];
function layoutPlate(L) {
  const used = {}; const out = [];
  const rk = i => i.k === 'salada' ? -1 : i.k === 'aveia' ? 9 : ORDER[F[i.k].g];
  const items = [...L].filter(i => !F[i.k].noimg).sort((a, b) => rk(a) - rk(b));
  const yo = items.find(i => i.k === 'iogurte');
  items.forEach(i => {
    const g = F[i.k].g; const idx = used[g] = (used[g] || 0); used[g]++;
    let [x, y] = (SLOTS[g] || [])[idx] || SPARE[(idx + out.length) % SPARE.length];
    let s = Math.max(.55, Math.min(1.45, Math.cbrt(i.g / F[i.k].ref))) * (i.k === 'iogurte' ? .9 : 1);
    if (i.k === 'aveia' && yo) { const p = out.find(o => o.i.k === 'iogurte'); if (p) { x = p.x; y = p.y; s *= .62; } }
    out.push({ i, x, y, s });
  });
  return out;
}
function Plate({ L, pm, size, newIds = [] }) {
  const lay = layoutPlate(L);
  return html`<div class="plate" style=${size ? `max-width:${size}px` : ''}>
    <img src=${A('prato.webp')} alt="Prato" />
    ${lay.map(o => html`<img key=${o.i.id} class=${'food' + (newIds.includes(o.i.id) && !RM ? ' enter' : '')} ref=${el => el && el.classList.contains('enter') && requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('enter')))}
      src=${A(o.i.k + '_mound.webp')} alt=${short(o.i.k)} style=${`left:${o.x * 100}%;top:${o.y * 100}%;width:${43.3 * .72 * o.s}%`} />`)}
    ${pm && html`<svg class="pm-overlay" viewBox="0 0 100 100"><circle cx="50" cy="50" r="31" fill="none" stroke="var(--accent)" stroke-width=".5" stroke-dasharray="1.5 1.5"/>
      <line x1="50" y1="19" x2="50" y2="81" stroke="var(--accent)" stroke-width=".6" stroke-dasharray="1.5 1.2"/><line x1="19" y1="50" x2="50" y2="50" stroke="var(--accent)" stroke-width=".6" stroke-dasharray="1.5 1.2"/>
      <text x="66" y="51" font-size="3.4" text-anchor="middle" fill="var(--accent)" font-weight="600">½ vegetais</text><text x="34" y="35" font-size="3.4" text-anchor="middle" fill="var(--accent)" font-weight="600">¼ carboidrato</text><text x="34" y="68" font-size="3.4" text-anchor="middle" fill="var(--accent)" font-weight="600">¼ proteína</text></svg>`}
  </div>`;
}

/* ------------------------------------------------------------------ marmita */
const CONT = { marmita2: [[.0925, .0964, .4802, .8071], [.5902, .0964, .3172, .8071]], marmita3: [[.0925, .0964, .3988, .8071], [.5088, .0964, .3988, .3911], [.5088, .5125, .3988, .3911]] };
const capOf = (div, pot) => CONT['marmita' + div].map(([x, y, w, h]) => (w * .2) * (h * .14) * .043 * 1e6 * pot / 750);
const compMl = c => c.reduce((a, i) => a + nut(i).ml, 0);
function Marmita({ m, sel, onSel, small }) {
  const caps = capOf(m.div, m.pot); const R = CONT['marmita' + m.div];
  return html`<div class="marm" style=${small ? 'max-width:100%' : ''}>
    <img class="pot" src=${A(`marmita${m.div}.webp`)} alt="Marmita" />
    ${R.map(([x, y, w, h], ci) => { const c = m.comps[ci] || []; const tot = compMl(c); const lvl = tot / caps[ci];
      return html`<div class=${'comp' + (sel === ci ? ' sel' : '')} style=${`left:${x * 100}%;top:${y * 100}%;width:${w * 100}%;height:${h * 100}%`} onClick=${() => onSel && onSel(ci)}>
        ${c.length ? c.map((i, n) => html`<div class="fill" style=${`width:${nut(i).ml / tot * 100}%;background-size:${.425 / (w * nut(i).ml / tot) * 100}% auto;background-repeat:repeat;background-image:url(${A(i.k + (NOFILL[i.k] ? '_mound' : '_fill') + '.webp')});${n ? 'margin-left:-6%;mask-image:linear-gradient(90deg,transparent,#000 12%);-webkit-mask-image:linear-gradient(90deg,transparent,#000 12%)' : ''}`}></div>`)
          : html`<span class="empty">${small ? '' : 'vazio'}</span>`}
        ${!small && c.length ? html`<span class=${'lvl' + (lvl > 1.02 ? ' over' : '')}>${fmt(Math.min(lvl * 100, 199))}%</span>` : ''}
      </div>`; })}
  </div>`;
}

/* ------------------------------------------------------------------ gráficos */
function LineChart({ data, labels, unit = '', h = 180, color = 'var(--chart)', target }) {
  const W = 560, H = h, l = 40, r = 12, t = 12, b = 26;
  const lo = Math.floor(Math.min(...data, target ?? 1e9) - .6), hi = Math.ceil(Math.max(...data, target ?? -1e9) + .6);
  const X = i => l + (W - l - r) * i / (data.length - 1), Y = v => t + (H - t - b) * (1 - (v - lo) / (hi - lo));
  const ticks = [lo, (lo + hi) / 2, hi];
  const d = data.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ');
  return html`<svg class="chart" viewBox=${`0 0 ${W} ${H}`} role="img" aria-label="Gráfico">
    ${ticks.map(v => html`<line x1=${l} x2=${W - r} y1=${Y(v)} y2=${Y(v)} stroke="var(--line)" /><text x=${l - 6} y=${Y(v) + 4} text-anchor="end">${fmt(v, 1)}</text>`)}
    ${target != null && html`<line x1=${l} x2=${W - r} y1=${Y(target)} y2=${Y(target)} stroke="var(--mut)" stroke-dasharray="4 4" /><text x=${W - r} y=${Y(target) - 5} text-anchor="end">meta ${fmt(target, 1)}${unit}</text>`}
    <path d=${d + ` L${X(data.length - 1)} ${H - b} L${l} ${H - b} Z`} fill=${color} opacity=".08" />
    <path d=${d} fill="none" stroke=${color} stroke-width="2" stroke-linejoin="round" />
    ${data.map((v, i) => i === data.length - 1 && html`<circle cx=${X(i)} cy=${Y(v)} r="4" fill=${color} />`)}
    ${labels.map((s, i) => ((i % 2 === 0 && i < labels.length - 2) || i === labels.length - 1) && html`<text x=${X(i)} y=${H - 8} text-anchor="middle">${s}</text>`)}
  </svg>`;
}
function Bars({ data, labels, h = 150 }) {
  const W = 560, H = h, l = 30, b = 24, t = 10; const bw = (W - l - 10) / data.length;
  return html`<svg class="chart" viewBox=${`0 0 ${W} ${H}`} role="img" aria-label="Adesão por semana">
    ${[0, 50, 100].map(v => html`<line x1=${l} x2=${W - 10} y1=${t + (H - t - b) * (1 - v / 100)} y2=${t + (H - t - b) * (1 - v / 100)} stroke="var(--line)" /><text x=${l - 6} y=${t + (H - t - b) * (1 - v / 100) + 4} text-anchor="end">${v}</text>`)}
    ${data.map((v, i) => html`<rect x=${l + i * bw + bw * .22} width=${bw * .56} y=${t + (H - t - b) * (1 - v / 100)} height=${(H - t - b) * v / 100} rx="3" fill=${v < 60 ? 'var(--bad)' : v < 75 ? 'var(--warn)' : 'var(--ok)'} opacity=".85" />
      <text x=${l + i * bw + bw / 2} y=${H - 7} text-anchor="middle">${labels[i]}</text>`)}
  </svg>`;
}
function Heat({ id, days = 14 }) {
  const H = S.hist[id].slice(-(days - 1)); const today = S.today[id];
  return html`<div class="heat" style=${`grid-template-columns:62px repeat(${days},minmax(8px,${days > 14 ? 16 : 22}px))`}>
    ${MEALS.map(([k, n], m) => html`<span>${n.split(' ')[0]}</span>${H.map(r => html`<i class=${r[m]} title=${n}></i>`)}<i class=${(today[m] || '') + ' now'}></i>`)}
  </div>`;
}
function QR({ seed = 7 }) {
  let x = seed; const rnd = () => (x = (x * 16807) % 2147483647) / 2147483647; const N = 25, cells = [];
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { const f = (i < 8 && j < 8) || (i < 8 && j > N - 9) || (i > N - 9 && j < 8); if (!f && rnd() > .52) cells.push([j, i]); }
  const fin = (a, b) => html`<rect x=${a} y=${b} width="7" height="7" fill="#111"/><rect x=${a + 1} y=${b + 1} width="5" height="5" fill="#fff"/><rect x=${a + 2} y=${b + 2} width="3" height="3" fill="#111"/>`;
  return html`<svg class="qr" viewBox="0 0 25 25" aria-label="QR ilustrativo">${cells.map(([a, b]) => html`<rect x=${a} y=${b} width="1" height="1" fill="#111"/>`)}${fin(0, 0)}${fin(N - 7, 0)}${fin(0, N - 7)}</svg>`;
}
function NutriRows({ s, t }) {
  const rows = [['Energia', s.kcal, t.kcal, 'kcal', 'var(--kcal)'], ['Proteína', s.p, t.p, 'g', 'var(--prot)'], ['Carboidrato', s.c, t.c, 'g', 'var(--carb)'], ['Gordura', s.f, t.f, 'g', 'var(--fat)']];
  return html`<div>${rows.map(([n, v, tt, u, c]) => html`<div class="nrow"><span>${n}</span><div class="meter"><i style=${`width:${Math.min(100, v / tt * 100)}%;background:${v > tt * 1.06 ? 'var(--bad)' : c}`}></i></div>
    <span class="v"><b>${fmt(v)}</b> <span class="mut">/ ${fmt(tt)} ${u}</span></span></div>`)}</div>`;
}
function MacroSplit({ s }) {
  const kp = s.p * 4, kc = s.c * 4, kf = s.f * 9, tt = kp + kc + kf || 1;
  return html`<div class="col" style="gap:6px"><div class="macro-bar"><i style=${`width:${kp / tt * 100}%;background:var(--prot)`}></i><i style=${`width:${kc / tt * 100}%;background:var(--carb)`}></i><i style=${`width:${kf / tt * 100}%;background:var(--fat)`}></i></div>
    <div class="legend"><span><i style="background:var(--prot)"></i>Proteína ${fmt(kp / tt * 100)}%</span><span><i style="background:var(--carb)"></i>Carboidrato ${fmt(kc / tt * 100)}%</span><span><i style="background:var(--fat)"></i>Gordura ${fmt(kf / tt * 100)}%</span><span>Fibras ${fmt(s.fib)} g</span></div></div>`;
}

/* ------------------------------------------------------------------ layout nutricionista */
const NAV = [['hoje', 'Hoje', 'hoje'], ['agenda', 'Agenda', 'agenda'], ['pacientes', 'Pacientes', 'pacientes'], ['mensagens', 'Mensagens', 'mensagens'], ['alimentos', 'Alimentos', 'alimentos']];
function go(page, extra = {}) { set(s => { s.page = page; Object.assign(s, extra); }); const h = page === 'paciente' ? 'paciente-' + S.pid : page; if (location.hash.slice(1) !== h) history.replaceState(null, '', '#' + h); window.scrollTo(0, 0); }
function Side() {
  const s = useStore(); const unread = Object.values(s.unread).reduce((a, b) => a + b, 0);
  return html`<aside class="side">
    <div class="who"><div class="avatar">MA</div><div><div style="font-weight:600">Marina Alves</div><div class="tiny mut">Nutricionista · CRN-2 00000</div></div></div>
    ${NAV.map(([k, n, ic]) => html`<button class="nav" aria-current=${s.page === k || (k === 'pacientes' && s.page === 'paciente') ? 'page' : 'false'} onClick=${() => go(k)} aria-label=${n}><${Icon} n=${ic} /> <span class="lbl">${n}</span>${k === 'mensagens' && unread ? html`<span class="badge">${unread}</span>` : ''}</button>`)}
    <div class="sidefoot" style="margin-top:auto;padding:10px;font-size:12px"><span class="mut">Dados fictícios para demonstração</span></div>
  </aside>`;
}

/* --- Hoje */
function Today() {
  const s = useStore();
  const attn = PATIENTS.map(p => { let f = p.flag; if (p.id === 'ana') { const a = adherence('ana'); const ev = s.events.find(e => e.pid === 'ana'); f = ev ? [ev.sev, ev.text] : a < 75 ? ['warn', `Adesão caiu para ${a}%`] : null; } return { p, f }; }).filter(x => x.f);
  const order = { bad: 0, warn: 1, info: 2, ok: 3 };
  attn.sort((a, b) => order[a.f[0]] - order[b.f[0]]);
  const appts = [['08:00', 'Helena Rocha', 'Retorno', 'helena', 'concluída'], ['09:00', 'Igor Matos', 'Retorno · online', 'igor', 'concluída'], ['10:30', 'Lívia Santos', 'Primeira consulta', null, 'agora'], ['11:30', 'Gustavo Teixeira', 'Retorno', 'gustavo', '']];
  const unread = Object.values(s.unread).reduce((a, b) => a + b, 0);
  const avg = Math.round(PATIENTS.filter(p => p.adh != null).reduce((a, p) => a + (p.id === 'ana' ? adherence('ana') : p.adh), 0) / PATIENTS.filter(p => p.adh != null).length);
  return html`<div class="main-in">
    <div class="pagehead"><div><div class="eyebrow">Sábado, 7 de novembro</div><h1 style="font-size:36px;margin-top:4px">Bom dia, Marina!</h1><div class="sub">${attn.length} pacientes precisam de você hoje.</div></div><button class="btn primary" onClick=${() => go('pacientes')}><${Icon} n="plus" s=${16} /> Novo plano</button></div>
    <div class="grid g4">
      <div class="card stat"><div class="k">Consultas hoje</div><div class="v">4</div><div class="d mut">2 concluídas</div></div>
      <div class="card stat"><div class="k">Precisam de atenção</div><div class="v">${attn.length}</div><div class="d mut">de ${PATIENTS.length} pacientes ativos</div></div>
      <div class="card stat"><div class="k">Mensagens</div><div class="v">${unread}</div><div class="d mut">não lidas</div></div>
      <div class="card stat hero"><div class="k">Adesão média · 7 dias</div><div class="v">${avg}%</div><div class="d">+3 pontos na semana</div></div>
    </div>
    <div class="grid g-side">
      <div class="card"><div class="card-h"><h2>Precisam de atenção</h2><span class="small mut">ordenado por prioridade</span></div>
        <div class="list">${attn.map(({ p, f }) => html`<div class=${'li click' + (p.id === 'ana' && s.events.length ? ' flash' : '')} key=${p.id + (p.id === 'ana' ? s.events.length : '')} onClick=${() => go('paciente', { pid: p.id, ptab: 'resumo' })}>
          <div class="avatar" style=${`box-shadow:0 0 0 2px var(--surface),0 0 0 4px var(--${f[0]})`}>${initials(p.n)}</div>
          <div class="grow"><div style="font-weight:500">${p.n}</div><div class="small mut">${f[1]}</div></div>
          <span class="small mut only-desk" style="white-space:nowrap">${p.goal}</span><${Icon} n="chev" s=${16} /></div>`)}</div></div>
      <div class="card"><div class="card-h"><h2>Agenda de hoje</h2><button class="btn sm" onClick=${() => go('agenda')}>Ver semana</button></div>
        <div class="list">${appts.map(([h, n, t, id, st]) => html`<div class=${'li' + (id ? ' click' : '')} onClick=${() => id && go('paciente', { pid: id, ptab: 'resumo' })}>
          <div style="width:44px;font-weight:600">${h}</div><div class="grow"><div style="font-weight:500">${n}</div><div class="small mut">${t}</div></div>
          ${st === 'agora' ? html`<${Pill} k="ok"><span class="dot"></span>agora<//>` : st ? html`<span class="small mut">${st}</span>` : ''}</div>`)}</div></div>
    </div>
    <div class="card"><div class="card-h"><h2>Atividade recente dos pacientes</h2></div>
      <div class="list">${[...s.events.slice(0, 4).map(e => [e.time, pat(e.pid).n, e.text, e.sev]), ['08:40', 'Júlia Farias', 'Registrou o café da manhã como planejado', 'ok'], ['08:15', 'Fábio Lima', 'Registrou dose semanal e sintomas leves', 'info'], ['07:42', 'Ana Ribeiro', 'Registrou o café da manhã como planejado', 'ok']].map(([t, n, x, k]) => html`
        <div class="li"><span class="small mut" style="width:44px">${t}</span><span class=${'pill ' + k}><span class="dot"></span></span><div class="grow"><b style="font-weight:500">${n}</b> <span class="mut">· ${x}</span></div></div>`)}</div></div>
  </div>`;
}

/* --- Agenda */
function Agenda() {
  const [dsel, setDsel] = useState(1);
  const days = ['Seg 9', 'Ter 10', 'Qua 11', 'Qui 12', 'Sex 13']; const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  const ev = [[0, 9, 'Gustavo Teixeira', 'Retorno', 'gustavo'], [0, 14, 'Lívia Santos', 'Retorno', null], [1, 14, 'Ana Ribeiro', 'Retorno · 4ª consulta', 'ana'], [1, 10, 'Paula Reis', 'Primeira consulta', null], [2, 16, 'Fábio Lima', 'Retorno · GLP-1', 'fabio'], [2, 11, 'Bianca Nunes', 'Online', null], [3, 9, 'Bruno Costa', 'Retorno', 'bruno'], [3, 15, 'Rafael Dias', 'Primeira consulta', null], [4, 18, 'Diego Souza', 'Retorno', 'diego'], [4, 10, 'Helena Rocha', 'Bioimpedância', null]];
  return html`<div class="main-in"><div class="pagehead"><div><h1>Agenda</h1><div class="sub">Semana de 9 a 13 de novembro</div></div><div class="row"><button class="btn">Hoje</button><button class="btn primary"><${Icon} n="plus" s=${16} /> Nova consulta</button></div></div>
    <div class="card only-mob"><div class="card-b col" style="padding-top:16px">
      <div class="seg" style="align-self:stretch;justify-content:space-between">${days.map((d, i) => html`<button aria-pressed=${dsel === i} onClick=${() => setDsel(i)}>${d}</button>`)}</div>
      ${hours.map(h => { const e = ev.find(x => x[0] === dsel && x[1] === h); return html`<div class="row" style="align-items:stretch;gap:10px"><span class="small mut" style="width:44px;padding-top:10px">${h}:00</span>
        ${e ? html`<div class="grow" onClick=${() => e[4] && go('paciente', { pid: e[4], ptab: 'resumo' })} style=${`cursor:${e[4] ? 'pointer' : 'default'};background:${e[3].includes('Primeira') ? 'var(--orange)' : 'var(--lime)'};color:#141a0c;border-radius:16px;padding:10px 14px`}><div style="font-weight:700">${e[2]}</div><div class="tiny" style="opacity:.7">${e[3]}</div></div>`
          : html`<div class="grow hatch" style="border-radius:16px;min-height:40px;display:grid;place-items:center"><span class="tiny mut">Livre</span></div>`}</div>`; })}
    </div></div>
    <div class="card tbl-wrap only-desk"><div style="display:grid;grid-template-columns:56px repeat(5,minmax(130px,1fr));min-width:700px;padding:12px">
      <div></div>${days.map((d, i) => html`<div style=${`padding:8px 10px;margin:3px;border-radius:999px;text-align:center;font-weight:700;font-family:var(--display);${i === 1 ? 'background:var(--lime);color:var(--lime-ink)' : 'background:var(--sunken)'}`}>${d}</div>`)}
      ${hours.map(h => html`<div class="small mut" style="padding:14px 6px 0">${h}:00</div>
        ${days.map((_, di) => { const e = ev.find(x => x[0] === di && x[1] === h); return html`<div class=${ev.find(x => x[0] === di && x[1] === h) ? '' : 'hatch'} style="border-radius:12px;margin:3px;min-height:46px">${e && html`
          <div onClick=${() => e[4] && go('paciente', { pid: e[4], ptab: 'resumo' })} style=${`cursor:${e[4] ? 'pointer' : 'default'};background:${e[3].includes('Primeira') ? 'var(--orange)' : 'var(--lime)'};color:#141a0c;border-radius:14px;padding:6px 10px;height:100%`}><div class="small" style="font-weight:700">${e[2]}</div><div class="tiny" style="opacity:.7">${e[3]}</div></div>`}</div>`; })}`)}
    </div></div></div>`;
}

/* --- Pacientes */
function Patients() {
  const [q, setQ] = useState(''); const [f, setF] = useState('todos');
  const L = PATIENTS.filter(p => norm(p.n).includes(norm(q)) && (f === 'todos' || (f === 'atencao' && (p.flag || (p.id === 'ana' && adherence('ana') < 75))) || (f === 'retorno' && p.flag && /Retorno/.test(p.flag[1]))));
  return html`<div class="main-in"><div class="pagehead"><div><h1>Pacientes</h1><div class="sub">${PATIENTS.length} ativos</div></div><button class="btn primary"><${Icon} n="plus" s=${16} /> Novo paciente</button></div>
    <div class="card"><div class="card-h"><div class="search" style="width:min(320px,100%)"><${Icon} n="search" s=${16} /><input placeholder="Buscar por nome" value=${q} onInput=${e => setQ(e.target.value)} aria-label="Buscar paciente" /></div>
      <div class="seg">${[['todos', 'Todos'], ['atencao', 'Precisam de atenção'], ['retorno', 'Retorno vencido']].map(([k, n]) => html`<button aria-pressed=${f === k} onClick=${() => setF(k)}>${n}</button>`)}</div></div>
      <div class="list only-mob">${L.map(p => { const a = p.id === 'ana' ? adherence('ana') : p.adh; return html`<div class="li click" onClick=${() => go('paciente', { pid: p.id, ptab: 'resumo' })}>
        <div class="avatar">${initials(p.n)}</div><div class="grow"><div style="font-weight:600">${p.n}</div><div class="tiny mut">${p.goal} · ${p.next}</div>${p.flag ? html`<div style="margin-top:6px"><${Pill} k=${p.flag[0]}>${p.flag[1]}<//></div>` : ''}</div>
        <div style="text-align:right"><div class="disp" style="font-size:18px;font-weight:700">${a == null ? '—' : a + '%'}</div><div class="tiny mut">adesão</div></div></div>`; })}</div>
      <div class="tbl-wrap only-desk"><table class="tbl"><thead><tr><th>Paciente</th><th>Objetivo</th><th>Próxima consulta</th><th>Adesão · 7 dias</th><th>Último registro</th><th>Peso</th><th></th></tr></thead><tbody>
      ${L.map(p => { const a = p.id === 'ana' ? adherence('ana') : p.adh; return html`<tr class="click" onClick=${() => go('paciente', { pid: p.id, ptab: 'resumo' })}>
        <td><div class="row"><div class="avatar">${initials(p.n)}</div><div><div style="font-weight:500">${p.n}</div><div class="tiny mut">${p.age} anos</div></div></div></td>
        <td>${p.goal}</td><td>${p.next}</td>
        <td>${a == null ? html`<span class="mut">sem dados</span>` : html`<div class="row"><div class="meter" style="width:70px"><i style=${`width:${a}%;background:${a < 60 ? 'var(--bad)' : a < 75 ? 'var(--warn)' : 'var(--ok)'}`}></i></div><span>${a}%</span></div>`}</td>
        <td class="mut">${p.last}</td><td>${fmt(p.w1, 1)} kg <span class=${'small'} style=${`color:${(p.w1 - p.w0) * (p.goal.includes('Hipertrofia') || p.goal.includes('Gestação') ? -1 : 1) < 0 ? 'var(--ok)' : 'var(--mut)'}`}>${p.w1 - p.w0 > 0 ? '+' : ''}${fmt(p.w1 - p.w0, 1)}</span></td>
        <td>${p.flag ? html`<${Pill} k=${p.flag[0]}>${p.flag[1].split(' há')[0].replace('Jantar fora do plano em 5 dos últimos 7 dias', 'Adesão baixa')}<//>` : ''}</td></tr>`; })}
      </tbody></table></div></div></div>`;
}

/* --- Paciente */
function PatientPage() {
  const s = useStore(); const p = pat(s.pid);
  const tabs = [['resumo', 'Resumo'], ['plano', 'Plano alimentar'], ['marmitas', 'Marmitas'], ['evolucao', 'Evolução'], ['registros', 'Registros']];
  const imc = p.w1 / (p.h * p.h);
  return html`<div class="main-in">
    <div class="row small mut"><button class="btn ghost sm" onClick=${() => go('pacientes')}><${Icon} n="back" s=${14} /> Pacientes</button></div>
    <div class="card"><div class="card-b row wrap phead" style="gap:16px">
      <div class="avatar lg">${initials(p.n)}</div>
      <div class="grow"><h1>${p.n}</h1><div class="mut">${p.age} anos · ${p.goal} · Próxima consulta ${p.next}</div></div>
      <dl class="kv" style="grid-template-columns:auto auto auto auto auto auto"><dt>Peso</dt><dd>${fmt(p.w1, 1)} kg</dd><dt>IMC</dt><dd>${fmt(imc, 1)}</dd><dt>Plano</dt><dd>v${s.ver[p.id]}</dd></dl>
      <button class="btn" onClick=${() => go('mensagens', { chat: p.id })}><${Icon} n="mensagens" s=${16} /> Mensagem</button>
    </div>
    <div class="tabs" role="tablist" style="padding:0 20px 16px">${tabs.map(([k, n]) => html`<button role="tab" aria-selected=${s.ptab === k} onClick=${() => { set(x => { x.ptab = k; }); history.replaceState(null, '', '#paciente-' + p.id + (k === 'resumo' ? '' : '-' + k)); }}>${n}</button>`)}</div></div>
    ${s.ptab === 'resumo' && html`<${Summary} p=${p} />`}
    ${s.ptab === 'plano' && html`<${PlanEditor} p=${p} />`}
    ${s.ptab === 'marmitas' && html`<${MarmitaTab} p=${p} />`}
    ${s.ptab === 'evolucao' && html`<${Evolution} p=${p} />`}
    ${s.ptab === 'registros' && html`<${Records} p=${p} />`}
  </div>`;
}
function weakMeal(id) { const c = [0, 0, 0, 0]; S.hist[id].slice(-7).forEach(r => r.forEach((v, i) => { if (v !== 'ok') c[i]++; })); S.today[id].forEach((v, i) => { if (v && v !== 'ok') c[i]++; }); return MEALS[c.indexOf(Math.max(...c))][1].toLowerCase(); }
function Summary({ p }) {
  const s = useStore(); const a = p.id === 'ana' ? adherence(p.id) : p.adh ?? 0; const ob = Object.entries(s.obst[p.id] || {}).sort((x, y) => y[1] - x[1]);
  const W = weightSeries(p); const wm = weakMeal(p.id);
  return html`<div class="grid g-side">
    <div class="col" style="gap:16px">
      <div class="card"><div class="card-h"><h2>Desde a última consulta</h2><span class="small mut">calculado dos registros · 27/10 a hoje</span></div>
        <div class="card-b"><div class="grid g3" style="gap:12px">
          <div><div class="small mut">Adesão ao plano</div><div style="font-size:22px;font-weight:600">${a}%</div><div class="meter" style="margin-top:6px"><i style=${`width:${a}%`}></i></div></div>
          <div><div class="small mut">Variação de peso</div><div style="font-size:22px;font-weight:600">${p.w1 - W[8] > 0 ? '+' : ''}${fmt(p.w1 - W[8], 1)} kg</div><div class="small mut">em 3 semanas</div></div>
          <div><div class="small mut">Refeição mais difícil</div><div style="font-size:22px;font-weight:600">${wm[0].toUpperCase() + wm.slice(1)}</div><div class="small mut">mais registros “diferente” ou “pulei”</div></div>
        </div>
        <div style="margin-top:16px"><div class="small mut" style="margin-bottom:6px">Últimos 14 dias</div><${Heat} id=${p.id} /></div>
        <div class="legend" style="margin-top:8px"><span><i style="background:var(--ok)"></i>como planejado</span><span><i style="background:var(--warn)"></i>diferente</span><span><i style="background:var(--bad)"></i>pulou</span></div>
        </div></div>
      <div class="card"><div class="card-h"><h2>O que o paciente relatou</h2></div><div class="card-b col">
        <div class="row wrap">${ob.length ? ob.map(([k, v]) => html`<${Pill}>${k} · ${v}×<//>`) : html`<span class="mut">Nenhum relato nesta semana.</span>`}</div>
        <div class="small mut">Trocas usadas a partir das opções aprovadas: <b style="color:var(--ink)">${(s.swaps[p.id] || 0) + 6}</b> nos últimos 14 dias (a mais comum: arroz → batata-doce no jantar).</div></div></div>
    </div>
    <div class="col" style="gap:16px">
      <div class="card"><div class="card-h"><h2>Notas da última consulta</h2><span class="small mut">27/10</span></div><div class="card-b small col" style="gap:6px;color:var(--ink-2)">
        <p>Relata fome no fim da tarde. Lanche aumentado com aveia.</p><p>Almoça fora 3×/semana, leva marmita 2×. Montar semana de marmitas.</p><p>Meta até a próxima consulta: 3 porções de vegetais por dia.</p></div></div>
      <div class="card"><div class="card-h"><h2>Mensagem sugerida</h2><${Pill}>rascunho<//></div><div class="card-b col">
        <p class="small">Oi, ${p.n.split(' ')[0]}! Vi seus registros da semana. O ${wm} está sendo o momento mais difícil${ob[0] ? `, e você comentou “${ob[0][0].toLowerCase()}”` : ''}. Na consulta a gente ajusta essa refeição, combinado?</p>
        <div class="row"><button class="btn sm" onClick=${() => { set(x => { (x.msgs[p.id] = x.msgs[p.id] || []).push(['out', `Oi, ${p.n.split(' ')[0]}! Vi seus registros da semana. O ${wm} está sendo o momento mais difícil. Na consulta a gente ajusta essa refeição, combinado?`, 'agora']); }); toast('Mensagem enviada'); }}>Revisar e enviar</button><span class="tiny mut">Gerado a partir dos registros; revise antes de enviar.</span></div></div></div>
    </div>
  </div>`;
}

/* --- Plano alimentar */
function diffPlans(a, b) {
  const out = [];
  MEALS.forEach(([m, n]) => {
    const A_ = a[m] || [], B_ = b[m] || [];
    B_.forEach(i => { const o = A_.find(x => x.k === i.k); if (!o) out.push(['add', `${n}: + ${short(i.k)} ${i.g} g`]); else if (o.g !== i.g) out.push(['chg', `${n}: ${short(i.k)} ${o.g} g → ${i.g} g`]); });
    A_.forEach(o => { if (!B_.find(x => x.k === o.k)) out.push(['rem', `${n}: − ${short(o.k)}`]); });
  });
  return out;
}
function AddFood({ onAdd }) {
  const [v, setV] = useState(''); const [ix, setIx] = useState(0); const [open, setOpen] = useState(false);
  const parts = v.trim(); const parsed = parts ? parse(parts) : null;
  const words = norm(v).replace(/^[\d.,]+\s*(g|gr|gramas)?\s*/, '').replace(/^(\w+)\s+(de\s+)?(sopa|cha|servir)?\s*/, (m0, u) => UNITS[u] ? '' : m0).trim();
  const cand = parts ? rankFoods(words || v).slice(0, 5) : [];
  const pick = k => { const r = parse(v, k); if (r && !r.err) { onAdd(r); setV(''); setOpen(false); setIx(0); } };
  return html`<div class="addrow">
    <input class="input" placeholder="Adicionar alimento: 150 arroz, 1 concha feijão, 2 cacetinhos…" value=${v} aria-label="Adicionar alimento"
      onInput=${e => { setV(e.target.value); setOpen(true); setIx(0); }} onBlur=${() => setTimeout(() => setOpen(false), 150)} onFocus=${() => setOpen(true)}
      onKeyDown=${e => { if (e.key === 'ArrowDown') { setIx(i => Math.min(i + 1, cand.length - 1)); e.preventDefault(); } else if (e.key === 'ArrowUp') { setIx(i => Math.max(i - 1, 0)); e.preventDefault(); } else if (e.key === 'Enter' && cand[ix]) { pick(cand[ix]); e.preventDefault(); } else if (e.key === 'Escape') setOpen(false); }} />
    ${open && cand.length > 0 && html`<div class="sugg" role="listbox">${cand.map((k, n) => { const r = parse(v, k); return html`<button role="option" aria-selected=${n === ix} onMouseDown=${e => { e.preventDefault(); pick(k); }}>
      <${Thumb} k=${k} s=${32} /><div class="grow"><div>${F[k].n}</div><div class="tiny mut">${r && !r.err ? `${r.g} g${measure({ k, g: r.g }) ? ' · ' + measure({ k, g: r.g }) : ''} · ${fmt(F[k].kcal * r.g / 100)} kcal` : ''}${F[k].syn.some(x => norm(x) === norm(words)) && norm(words) !== norm(short(k)) ? ' · também chamado de ' + words : ''}</div></div><span class="tiny mut">Enter</span></button>`; })}</div>`}
  </div>`;
}
function PlanEditor({ p }) {
  const s = useStore(); const plan = s.plans[p.id]; const [newIds, setNew] = useState([]); const [openSw, setOpenSw] = useState(null);
  const day = sum(Object.values(plan).flat()); const L = plan[s.meal]; const ms = sum(L);
  const changes = diffPlans(s.pub[p.id], plan);
  const add = (m, r) => { const n = it(r.k, r.g); set(x => { x.plans[p.id][m].push(n); x.meal = m; }); setNew([n.id]); };
  const upd = (m, id, g) => set(x => { const i = x.plans[p.id][m].find(i => i.id === id); if (i) i.g = Math.max(1, Math.min(2000, g || 0)); });
  const del = (m, id) => set(x => { x.plans[p.id][m] = x.plans[p.id][m].filter(i => i.id !== id); });
  const swap = (m, id, sb) => set(x => { const L2 = x.plans[p.id][m]; const j = L2.findIndex(i => i.id === id); L2[j] = it(sb.k, sb.g); });
  return html`<div class="grid g-plan">
    <div class="col" style="gap:12px">
      <div class="row sp wrap"><div class="row"><h2>Plano v${s.ver[p.id]}</h2>${changes.length ? html`<${Pill} k="warn">${changes.length} alteraç${changes.length > 1 ? 'ões' : 'ão'} não publicada${changes.length > 1 ? 's' : ''}<//>` : html`<${Pill} k="ok">publicado e visível no app<//>`}</div>
        <div class="row"><button class="btn" onClick=${() => set(x => { x.modal = { type: 'apresentar', pid: p.id }; })}><${Icon} n="present" s=${16} /> Apresentar</button>
        <button class="btn primary" disabled=${!changes.length} onClick=${() => set(x => { x.modal = { type: 'publicar', pid: p.id }; })}>Publicar alterações</button></div></div>
      ${MEALS.map(([m, n, h]) => { const Lm = plan[m]; const sm = sum(Lm); return html`<div class=${'meal' + (s.meal === m ? ' sel' : '')}>
        <div class="meal-h" onClick=${() => set(x => { x.meal = m; })}><div class="grow"><span class="t">${n}</span> <span class="mut small">· ${h}</span></div><span class="small"><b>${fmt(sm.kcal)}</b> <span class="mut">kcal · P ${fmt(sm.p)} · C ${fmt(sm.c)} · G ${fmt(sm.f)}</span></span></div>
        <div class="items">${Lm.map(i => { const nn = nut(i); return html`<div class=${'item' + (newIds.includes(i.id) ? ' new' : '')} key=${i.id}>
          <${Thumb} k=${i.k} /><div style="min-width:0"><div style="font-weight:500">${F[i.k].n}</div><div class="tiny mut">${measure(i) || '—'} · P ${fmt(nn.p)} · C ${fmt(nn.c)} · G ${fmt(nn.f)}</div></div>
          <label class="qty"><input type="number" inputmode="numeric" value=${i.g} aria-label=${'Gramas de ' + short(i.k)} onChange=${e => upd(m, i.id, +e.target.value)} /><span>g</span></label>
          <span class="r num" style="text-align:right">${fmt(nn.kcal)} kcal</span>
          <button class="iconbtn" title="Remover" aria-label=${'Remover ' + short(i.k)} onClick=${() => del(m, i.id)}><${Icon} n="x" s=${15} /></button>
          <div class="swaps">${subs(i).length > 0 && html`<button class="btn ghost sm" style="padding:2px 4px" onClick=${() => setOpenSw(openSw === i.id ? null : i.id)}><${Icon} n="swap" s=${14} /> Trocas aprovadas (${subs(i).length})</button>`}
            ${openSw === i.id && subs(i).map(sb => html`<button class="swap" title="Usar esta troca no plano" onClick=${() => swap(m, i.id, sb)}>${short(sb.k)} · ${sb.g} g</button>`)}</div>
        </div>`; })}</div>
        ${s.meal === m && html`<${AddFood} onAdd=${r => add(m, r)} />`}
      </div>`; })}
    </div>
    <div class="col" style="gap:12px;position:sticky;top:70px;align-self:start">
      <div class="card"><div class="card-h"><div><h2>${MEALS.find(x => x[0] === s.meal)[1]}</h2><div class="small mut">${fmt(ms.kcal)} kcal · cerca de ${fmt(ms.ml, 0)} ml de comida</div></div>
        <div class="row"><button class="btn sm" aria-pressed=${s.pm} onClick=${() => set(x => { x.pm = !x.pm; })}>${s.pm ? 'Ocultar' : 'Método do prato'}</button><button class="btn sm" onClick=${() => set(x => { x.modal = { type: 'spin', meal: x.meal, changed: !heroFor(x.meal, x.plans[p.id][x.meal]) }; })}><${Icon} n="cube" s=${15} /> 3D</button></div></div>
        <div class="card-b">${heroFor(s.meal, L) && !s.pm ? html`<div class="table-surface hero-wrap"><${Hero} meal=${s.meal} /><span class="illus" style="color:#55605a">Renderizado no Blender · porções do plano</span></div>`
          : html`<div class="table-surface"><${Plate} L=${L} pm=${s.pm} newIds=${newIds} /><span class="illus">${s.pm ? 'Ilustrativo · porção pelo volume estimado' : 'Prévia montada com as fotos de cada alimento'}</span></div>`}
          <div style="margin-top:12px"><${MacroSplit} s=${ms} /></div></div></div>
      <div class="card"><div class="card-h"><h2>Total do dia</h2><span class="small mut">meta ${fmt(T.kcal)} kcal</span></div><div class="card-b tight"><${NutriRows} s=${day} t=${T} /></div></div>
    </div>
  </div>`;
}

/* --- Marmitas */
const WEEK = [['Seg', '09/11', [['arroz', 135], ['feijao', 100]], [['frango', 120]], [['cenoura', 80]], 'Geladeira · consumir até 09/11'], ['Ter', '10/11', [['batatadoce', 150]], [['guisado', 100]], [['brocolis', 80]], 'Geladeira · consumir até 10/11'],
  ['Qua', '11/11', [['integral', 135], ['feijao', 80]], [['tilapia', 130]], [['abobrinha', 90]], 'Geladeira · consumir até 11/11'], ['Qui', '12/11', [['macarrao', 140]], [['frango', 120]], [['tomate', 80]], 'Congelar no domingo; descongelar na véspera'], ['Sex', '13/11', [['aipim', 120]], [['patinho', 100]], [['cenoura', 80]], 'Congelar no domingo; descongelar na véspera']]
  .map(([d, dt, a, b, c, st]) => ({ d, dt, st, m: { pot: 750, div: 3, comps: [a, b, c].map(x => x.map(([k, g]) => it(k, g))) } }));
function MarmitaTab({ p }) {
  const s = useStore(); const M = s.marm; const caps = capOf(M.div, M.pot); const tot = sum(M.comps.flat()); const meta = 540;
  const over = M.comps.map((c, i) => compMl(c) > caps[i] * 1.02);
  const agg = {}; WEEK.forEach(x => x.m.comps.flat().forEach(i => { agg[i.k] = (agg[i.k] || 0) + i.g; }));
  const addTo = k => set(x => { const f = F[k]; const g = f.m[f.def[0]] * Math.min(f.def[1], 2); x.marm.comps[x.marm.sel].push(it(k, g)); });
  return html`<div class="col" style="gap:16px">
    <div class="grid g-plan">
      <div class="card"><div class="card-h"><div><h2>Marmita do almoço</h2><div class="small mut">Meta da refeição ${meta} kcal · toque em um compartimento e escolha o alimento</div></div>
        <div class="row"><select class="input" aria-label="Tamanho do pote" value=${M.pot} onChange=${e => set(x => { x.marm.pot = +e.target.value; })}>${[500, 750, 1000].map(v => html`<option value=${v}>${v} ml</option>`)}</select>
          <select class="input" aria-label="Divisões" value=${M.div} onChange=${e => set(x => { const d = +e.target.value; if (d === x.marm.div) return; x.marm.comps = d === 2 ? [x.marm.comps[0], [...x.marm.comps[1], ...x.marm.comps[2]]] : [x.marm.comps[0], x.marm.comps[1], []]; x.marm.div = d; x.marm.sel = 0; })}><option value="2">2 divisões</option><option value="3">3 divisões</option></select>
          <button class="btn" onClick=${() => set(x => { x.modal = { type: '3d', kind: 'marmita', M: JSON.parse(JSON.stringify(x.marm)) }; })}><${Icon} n="cube" s=${15} /> 3D e AR</button></div></div>
        <div class="card-b col" style="gap:14px">
          <div class="table-surface"><${Marmita} m=${M} sel=${M.sel} onSel=${ci => set(x => { x.marm.sel = ci; })} /></div>
          <div class="row wrap sp"><div class="row wrap">${over.some(Boolean) ? html`<${Pill} k="bad">Compartimento ${over.indexOf(true) + 1} acima da borda<//>` : Math.abs(tot.kcal / meta - 1) <= .07 ? html`<${Pill} k="ok">Dentro da meta<//>` : html`<${Pill} k=${tot.kcal > meta ? 'warn' : 'info'}>${tot.kcal > meta ? 'Acima' : 'Abaixo'} da meta<//>`}
            <span class="small"><b>${fmt(tot.kcal)}</b> <span class="mut">de ${meta} kcal · P ${fmt(tot.p)} g · C ${fmt(tot.c)} g · G ${fmt(tot.f)} g</span></span></div></div>
          <div class="grid comps" style=${`grid-template-columns:repeat(${M.div},minmax(0,1fr));gap:10px`}>${M.comps.map((c, ci) => html`<div class=${'meal' + (M.sel === ci ? ' sel' : '')} style="padding:10px;cursor:pointer" onClick=${() => set(x => { x.marm.sel = ci; })}>
            <div class="small" style="font-weight:600">Compartimento ${ci + 1}</div><div class="tiny" style=${over[ci] ? 'color:var(--bad)' : 'color:var(--mut)'}>${fmt(compMl(c))} de ${fmt(caps[ci])} ml</div>
            <div class="meter" style="margin-top:6px"><i style=${`width:${Math.min(100, compMl(c) / caps[ci] * 100)}%;background:${over[ci] ? 'var(--bad)' : 'var(--accent)'}`}></i></div>
            ${c.map(i => html`<div class="row small" style="margin-top:8px;align-items:flex-start"><${Thumb} k=${i.k} s=${28} /><span class="grow">${shortN(i.k)}<br /><span class="tiny mut">${i.g} g · ${fmt(nut(i).kcal)} kcal</span></span><button class="iconbtn" style="width:24px;height:24px" aria-label="Remover" onClick=${e => { e.stopPropagation(); set(x => { x.marm.comps[ci] = x.marm.comps[ci].filter(y => y.id !== i.id); }); }}><${Icon} n="x" s=${13} /></button></div>`)}
            ${!c.length && html`<div class="small mut" style="margin-top:6px">Vazio</div>`}</div>`)}</div>
          <div><div class="small mut" style="margin-bottom:6px">Adicionar ao compartimento ${M.sel + 1}</div><div class="palette">${Object.keys(F).filter(k => F[k].marm).map(k => html`<button onClick=${() => addTo(k)}><${Thumb} k=${k} s=${28} />${short(k).replace(/ (cozid[oa]|grelhad[oa]|refogad[oa]|em rodelas)$/, '')}</button>`)}</div></div>
        </div></div>
      <div class="col" style="gap:16px">
        <div class="card"><div class="card-h"><div><h2>Lista de compras da semana</h2><div class="small mut">5 marmitas · quantidades prontas para comer</div></div></div>
          <div class="tbl-wrap"><table class="tbl"><tbody>${Object.entries(agg).sort((a, b) => b[1] - a[1]).map(([k, g]) => html`<tr><td><div class="row"><${Thumb} k=${k} s=${28} />${F[k].n}</div></td><td class="r">${g >= 1000 ? fmt(g / 1000, 2) + ' kg' : g + ' g'}</td></tr>`)}</tbody></table></div>
          <div class="card-b row sp" style="border-top:1px solid var(--line)"><span class="small mut">Custo estimado (preços fictícios)</span><b>R$ ${fmt(Object.entries(agg).reduce((a, [k, g]) => a + F[k].price * g / 100, 0), 2)}</b></div></div>
      </div>
    </div>
    <div class="card"><div class="card-h"><div><h2>Semana em marmitas</h2><div class="small mut">Preparo no domingo, 08/11</div></div><button class="btn" onClick=${() => toast('Semana enviada para o app da paciente')}>Enviar para ${p.n.split(' ')[0]}</button></div>
      <div class="card-b"><div class="wk">${WEEK.map((x, n) => html`<div class="wkc"><div class="row sp small" style="margin-bottom:6px"><b>${x.d} ${x.dt}</b><span class="mut">${fmt(sum(x.m.comps.flat()).kcal)} kcal</span></div><${Marmita} m=${x.m} small=${true} />
        <div class="tiny mut" style="margin-top:6px">${x.m.comps.flat().map(i => short(i.k).replace(/ (cozid[oa]|grelhad[oa]|refogad[oa]|em rodelas)$/, '')).join(' · ')}</div></div>`)}</div>
      <h3 style="margin:18px 0 8px">Etiquetas para a tampa</h3>
      <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px">${WEEK.map((x, n) => html`<div class="etq"><div><b>${x.d} ${x.dt} · Almoço</b><div>${x.m.comps.flat().map(i => short(i.k)).join(', ')}</div><div class="mut" style="margin-top:4px">${fmt(sum(x.m.comps.flat()).kcal)} kcal · preparo 08/11</div><div class="mut">${x.st}</div></div><${QR} seed=${101 + n * 977} /></div>`)}</div></div></div>
  </div>`;
}

/* --- Evolução */
function Evolution({ p }) {
  const W = weightSeries(p); const lb = ['17/08', '24/08', '31/08', '07/09', '14/09', '21/09', '28/09', '05/10', '12/10', '19/10', '26/10', '02/11'];
  const r = seeded(p.id.length * 77); const adh = [62, 68, 71, 66, 74, 79, 77, 81].map(v => Math.max(30, Math.min(98, v + (p.adh ? p.adh - 80 : -20) + Math.round((r() - .5) * 8))));
  const meas = [['Cintura', 88, 83.5, 'cm'], ['Quadril', 104, 101, 'cm'], ['Gordura corporal', 33.1, 30.4, '%'], ['Massa magra', 49.2, 49.6, 'kg']];
  return html`<div class="grid g2">
    <div class="card"><div class="card-h"><div><h2>Peso</h2><div class="small mut">últimas 12 semanas · balança de casa e consultório</div></div><b>${fmt(p.w1, 1)} kg</b></div><div class="card-b"><${LineChart} data=${W} labels=${lb} unit=" kg" target=${p.goal === 'Emagrecimento' ? +(p.w0 * .9).toFixed(1) : null} /></div></div>
    <div class="card"><div class="card-h"><div><h2>Adesão por semana</h2><div class="small mut">% de refeições registradas como planejado</div></div></div><div class="card-b"><${Bars} data=${adh} labels=${['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8']} /></div></div>
    <div class="card"><div class="card-h"><h2>Medidas</h2><span class="small mut">17/08 → 27/10</span></div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Medida</th><th class="r">Início</th><th class="r">Atual</th><th class="r">Variação</th></tr></thead><tbody>
      ${meas.map(([n, a, b, u]) => html`<tr><td>${n}</td><td class="r">${fmt(a, 1)} ${u}</td><td class="r">${fmt(b, 1)} ${u}</td><td class="r" style=${`color:${(b - a) * (n === 'Massa magra' ? -1 : 1) < 0 ? 'var(--ok)' : 'var(--bad)'}`}>${b - a > 0 ? '+' : ''}${fmt(b - a, 1)}</td></tr>`)}</tbody></table></div></div>
    <div class="card"><div class="card-h"><h2>Exames</h2><span class="small mut">03/10 · laboratório</span></div><div class="tbl-wrap"><table class="tbl"><tbody>
      ${[['Glicose em jejum', '92 mg/dL', 'ok'], ['Hemoglobina glicada', '5,4%', 'ok'], ['LDL', '138 mg/dL', 'warn'], ['Ferritina', '28 ng/mL', 'ok'], ['Vitamina D', '24 ng/mL', 'warn']].map(([n, v, k]) => html`<tr><td>${n}</td><td class="r">${v}</td><td class="r"><${Pill} k=${k}>${k === 'ok' ? 'normal' : 'atenção'}<//></td></tr>`)}</tbody></table></div></div>
  </div>`;
}

/* --- Registros */
function Records({ p }) {
  const s = useStore();
  const entries = [...s.events.filter(e => e.pid === p.id && e.meal != null).map(e => ({ d: 'Hoje', t: e.time, m: e.meal, st: e.st, note: e.note, photo: e.photo })),
    { d: 'Hoje', t: '07:42', m: 0, st: 'ok' }, { d: 'Ontem', t: '20:35', m: 3, st: 'dif', note: 'Fome à noite', photo: [it('patinho', 150), it('arroz', 180), it('salada', 40)] }, { d: 'Ontem', t: '16:10', m: 2, st: 'ok' }, { d: 'Ontem', t: '12:50', m: 1, st: 'ok' }, { d: 'Qui 05/11', t: '21:05', m: 3, st: 'pul', note: 'Trabalho' }];
  const L = { ok: ['ok', 'Como planejado'], dif: ['warn', 'Diferente'], pul: ['bad', 'Pulou'] };
  return html`<div class="grid g-side">
    <div class="card"><div class="card-h"><h2>Registros</h2><span class="small mut">o que a paciente marcou no app</span></div>
      <div class="list">${entries.map(e => html`<div class="li"><div style="width:84px"><div class="small" style="font-weight:500">${e.d}</div><div class="tiny mut">${e.t}</div></div>
        ${e.photo ? html`<div style="width:64px;flex:none"><${Plate} L=${e.photo} size=${64} /></div>` : html`<div style="width:64px;flex:none"></div>`}
        <div class="grow"><div style="font-weight:500">${MEALS[e.m][1]}</div><div class="small mut">${e.photo ? 'Foto confirmada pela paciente · estimativa' : e.note ? '' : 'Registro em 1 toque'}${e.note ? (e.photo ? ' · ' : '') + 'Relatou: ' + e.note : ''}</div></div>
        <${Pill} k=${L[e.st][0]}>${L[e.st][1]}<//></div>`)}</div></div>
    <div class="card"><div class="card-h"><h2>Últimos 28 dias</h2></div><div class="card-b"><${Heat} id=${p.id} days=${28} /></div></div>
  </div>`;
}

/* --- Mensagens */
function Messages() {
  const s = useStore(); const ids = Object.keys(s.msgs); const cur = s.chat && s.msgs[s.chat] ? s.chat : ids[0]; const [txt, setTxt] = useState('');
  useEffect(() => { if (s.unread[cur]) set(x => { x.unread[cur] = 0; }); }, [cur]);
  const sugg = { diego: 'Pode sim! Nos dias de treino, 1 dose de whey (30 g) substitui os 2 ovos do café. Nos outros dias, mantém os ovos.', ana: 'Pode deixar, vou ajustar o jantar na terça.', carla: 'Entendo, semana puxada. Vamos simplificar o jantar: deixei duas opções rápidas no seu plano.' };
  const send = t => { if (!t.trim()) return; set(x => { x.msgs[cur].push(['out', t.trim(), 'agora']); }); setTxt(''); };
  return html`<div class="main-in"><div class="pagehead"><h1>Mensagens</h1><span class="small mut">Horário de atendimento: seg a sex, 8h às 18h</span></div>
    <div class="card msgs">
      <div class="msg-list">${ids.map(id => html`<div class=${'li click'} style=${cur === id ? 'background:var(--sunken)' : ''} onClick=${() => set(x => { x.chat = id; })}><div class="avatar">${initials(pat(id).n)}</div><div class="grow"><div style="font-weight:500">${pat(id).n}</div><div class="tiny mut" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.msgs[id].at(-1)[1]}</div></div>${s.unread[id] ? html`<span class="badge">${s.unread[id]}</span>` : ''}</div>`)}</div>
      <div class="col" style="gap:0">
        <div class="card-h"><div class="row"><div class="avatar">${initials(pat(cur).n)}</div><b style="font-weight:600">${pat(cur).n}</b></div><button class="btn sm" onClick=${() => go('paciente', { pid: cur, ptab: 'resumo' })}>Abrir ficha</button></div>
        <div class="col grow" style="padding:16px;gap:8px">${s.msgs[cur].map(([d, t, h]) => html`<div class=${'msg ' + d}>${t}<div class="tiny" style="opacity:.7;margin-top:2px">${h}</div></div>`)}</div>
        <div style="border-top:1px solid var(--line);padding:12px;display:flex;flex-direction:column;gap:8px">
          ${sugg[cur] && html`<div class="row small" style="background:var(--sunken);border-radius:8px;padding:8px 10px"><span class="grow"><span class="mut">Resposta sugerida a partir das trocas aprovadas:</span> ${sugg[cur]}</span><button class="btn sm" onClick=${() => setTxt(sugg[cur])}>Usar</button></div>`}
          <div class="row"><input class="input grow" placeholder="Escreva uma mensagem" value=${txt} onInput=${e => setTxt(e.target.value)} onKeyDown=${e => e.key === 'Enter' && send(txt)} aria-label="Mensagem" /><button class="btn primary" onClick=${() => send(txt)}><${Icon} n="send" s=${15} /> Enviar</button></div>
        </div></div></div></div>`;
}

/* --- Alimentos */
function Foods() {
  const [q, setQ] = useState(''); const [sel, setSel] = useState('arroz');
  const ks = q ? rankFoods(q) : Object.keys(F); const f = F[sel];
  return html`<div class="main-in"><div class="pagehead"><div><h1>Alimentos</h1><div class="sub">Base de demonstração · valores aproximados por 100 g · nomes regionais incluídos</div></div></div>
    <div class="grid g-side">
      <div class="card"><div class="card-h"><div class="search" style="width:min(340px,100%)"><${Icon} n="search" s=${16} /><input placeholder="Buscar: aipim, cacetinho, bergamota…" value=${q} onInput=${e => setQ(e.target.value)} aria-label="Buscar alimento" /></div><span class="small mut">${ks.length} alimentos</span></div>
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Alimento</th><th>Grupo</th><th class="r">kcal</th><th class="r">P</th><th class="r">C</th><th class="r">G</th></tr></thead><tbody>
        ${ks.map(k => html`<tr class="click" style=${sel === k ? 'background:var(--sunken)' : ''} onClick=${() => setSel(k)}><td><div class="row"><${Thumb} k=${k} s=${34} /><div><div>${F[k].n}</div><div class="tiny mut">${F[k].syn.filter(x => norm(x) !== norm(short(k)) && !norm(short(k)).includes(norm(x))).slice(0, 3).join(', ')}</div></div></div></td>
          <td class="mut">${GRP[F[k].g]}</td><td class="r">${F[k].kcal}</td><td class="r">${fmt(F[k].p, 1)}</td><td class="r">${fmt(F[k].c, 1)}</td><td class="r">${fmt(F[k].f, 1)}</td></tr>`)}</tbody></table></div></div>
      <div class="card" style="align-self:start"><div class="card-b col">
        ${!f.noimg && html`<div class="table-surface"><img src=${A(sel + '_mound.webp')} alt=${f.n} style="width:100%;max-width:260px" /></div>`}
        <h2>${f.n}</h2><div class="small mut">${GRP[f.g]} · densidade aprox. ${fmt(f.d, 2)} g/ml</div>
        <dl class="kv"><dt>Energia</dt><dd>${f.kcal} kcal</dd><dt>Proteína</dt><dd>${fmt(f.p, 1)} g</dd><dt>Carboidrato</dt><dd>${fmt(f.c, 1)} g</dd><dt>Gordura</dt><dd>${fmt(f.f, 1)} g</dd><dt>Fibras</dt><dd>${fmt(f.fib, 1)} g</dd></dl>
        <div><div class="small mut" style="margin-bottom:4px">Medidas caseiras</div>${Object.entries(f.m).map(([m, g]) => html`<div class="row sp small"><span>1 ${m}</span><span>${g} g</span></div>`)}</div>
        <div class="tiny mut">Imagem gerada no Blender para o protótipo. Valores aproximados, só para demonstração.</div></div></div>
    </div></div>`;
}

/* ------------------------------------------------------------------ app do paciente */
const PID = 'ana';
function PatientApp() {
  const s = useStore(); const tab = s.papp.tab;
  const tabs = [['hoje', 'Hoje', 'hoje'], ['plano', 'Plano', 'plano'], ['marmitas', 'Marmitas', 'marmita'], ['progresso', 'Progresso', 'progresso']];
  return html`<div class="phone"><div class="screen">
    <div class="pstatus"><span>9:41</span><span>●●● 5G</span></div>
    <div class="pscroll">${tab === 'hoje' && html`<${PHoje} />`}${tab === 'plano' && html`<${PPlano} />`}${tab === 'marmitas' && html`<${PMarm} />`}${tab === 'progresso' && html`<${PProg} />`}</div>
    <nav class="ptabs">${tabs.map(([k, n, ic]) => html`<button aria-label=${n} title=${n} aria-current=${tab === k ? 'page' : 'false'} onClick=${() => set(x => { x.papp.tab = k; x.papp.sheet = null; })}><${Icon} n=${ic} s=${22} /></button>`)}</nav>
    ${s.papp.sheet && html`<div class="sheet-bg" onClick=${() => set(x => { x.papp.sheet = null; })}></div><${Sheet} />`}
  </div></div>`;
}
function nextMeal() { return S.today[PID].findIndex(x => !x); }
function log(st, extra = {}) {
  const mi = nextMeal(); if (mi < 0) return;
  const now = ['07:42', '12:41', '16:08', '20:22'][mi];
  set(x => { x.today[PID][mi] = st; x.papp.sheet = null;
    x.events.unshift({ pid: PID, time: now, meal: mi, st, sev: st === 'ok' ? 'ok' : st === 'dif' ? 'warn' : 'bad', text: `${st === 'ok' ? 'Registrou' : st === 'dif' ? 'Comeu diferente no' : 'Pulou o'} ${MEALS[mi][1].toLowerCase()}${st === 'ok' ? ' como planejado' : ''}${extra.note ? ' · ' + extra.note : ''}`, ...extra });
    if (extra.note) extra.note.split(', ').forEach(o => { x.obst[PID][o] = (x.obst[PID][o] || 0) + 1; });
  });
}
function PHoje() {
  const s = useStore(); const mi = nextMeal(); const plan = s.pub[PID]; const done = s.today[PID].filter(Boolean).length;
  const [swapFor, setSwapFor] = useState(null); const [local, setLocal] = useState(null);
  const L = mi >= 0 ? (local && local.mi === mi ? local.L : plan[MEALS[mi][0]]) : [];
  return html`
    <div class="row sp" style="margin-top:6px"><div class="row"><div class="avatar" style="width:46px;height:46px;background:var(--lime);color:var(--lime-ink)">AR</div><div><div class="small mut">Sábado, 7 nov</div><div class="disp" style="font-size:22px;font-weight:700;line-height:1.1">Oi, Ana!</div></div></div><button class="iconbtn" style="width:44px;height:44px" aria-label="Notificações"><${Icon} n="bell" /></button></div>
    <h1 style="font-size:30px;line-height:1.1;margin:6px 0 2px">Pronta para o almoço?</h1>
    <div class="grid" style="grid-template-columns:1fr 1fr;gap:10px"><div class="pcard" style="background:var(--lime);color:var(--lime-ink)"><div class="small" style="opacity:.7;font-weight:600">Hoje</div><div class="disp" style="font-size:30px;font-weight:800;line-height:1.1">${done}<span style="font-size:16px;opacity:.6">/4</span></div><div class="tiny" style="opacity:.7">refeições registradas</div></div>
      <div class="pcard"><div class="small mut" style="font-weight:600">Semana</div><div class="disp" style="font-size:30px;font-weight:800;line-height:1.1">${fmt(adherence(PID))}<span style="font-size:16px;color:var(--mut)">%</span></div><div class="tiny mut">no plano</div></div></div>
    ${mi < 0 ? html`<div class="pcard col" style="align-items:center;text-align:center;padding:24px"><div style="color:var(--ok)"><${Icon} n="check" s=${32} /></div><h2>Dia completo</h2><p class="small mut">Você registrou todas as refeições de hoje.</p><button class="btn sm" onClick=${() => set(x => { x.today[PID] = ['ok', null, null, null]; })}>Recomeçar demonstração</button></div>` : html`
    <div class="pcard cream col" style="gap:10px">
      <div class="row sp"><div><div class="eyebrow" style="color:var(--cream-mut)">Próxima refeição</div><h2 style="font-size:22px">${MEALS[mi][1]}</h2></div><div style="text-align:right"><div class="disp" style="font-size:22px;font-weight:800">${MEALS[mi][2]}</div><div class="tiny mut">${fmt(sum(L).kcal)} kcal</div></div></div>
      <div class="table-surface hero-wrap">${heroFor(MEALS[mi][0], L) ? html`<${Hero} meal=${MEALS[mi][0]} />` : html`<${Plate} L=${L} size=${260} />`}
        <button class="btn sm on-photo" onClick=${() => set(x => { x.modal = { type: 'spin', meal: MEALS[mi][0], changed: !heroFor(MEALS[mi][0], L) }; })}><${Icon} n="cube" s=${15} /> Ver em 3D</button></div>
      <div>${L.map((i, n) => html`<div class="row" style="padding:7px 0;border-top:1px solid var(--line)"><${Thumb} k=${i.k} s=${34} /><div class="grow"><div style="font-weight:500">${short(i.k)}</div><div class="tiny mut">${measure(i) || i.g + ' g'}</div></div>
        ${subs(i).length > 0 && html`<button class="btn sm swapbtn" aria-expanded=${swapFor === n} onClick=${() => setSwapFor(swapFor === n ? null : n)}>${swapFor === n ? 'Fechar' : 'Trocar'}</button>`}</div>
        ${swapFor === n && html`<div class="row wrap" style="padding:0 0 8px 42px;gap:6px">${subs(i).map(sb => html`<button class="chip" onClick=${() => { const L2 = [...L]; L2[n] = it(sb.k, sb.g); setLocal({ mi, L: L2 }); setSwapFor(null); set(x => { x.swaps[PID]++; x.events.unshift({ pid: PID, time: 'agora', sev: 'info', text: `Trocou ${short(i.k).toLowerCase()} por ${short(sb.k).toLowerCase()} (opção aprovada)` }); }); }}>${short(sb.k)} · ${measure(sb) || sb.g + ' g'}</button>`)}</div>`}`)}</div>
      <button class="pbtn primary" onClick=${() => log('ok')}>Comi como planejado</button>
      <div class="grid g2" style="gap:8px;grid-template-columns:1fr 1fr"><button class="pbtn" onClick=${() => set(x => { x.papp.sheet = { step: 'como' }; })}>Comi diferente</button><button class="pbtn" onClick=${() => set(x => { x.papp.sheet = { step: 'obst', st: 'pul' }; })}>Pulei</button></div>
    </div>`}
    <div class="pcard"><div class="row sp" style="margin-bottom:8px"><h3>Últimos 14 dias</h3><span class="tiny mut">verde = como planejado</span></div><${Heat} id=${PID} /></div>`;
}
const PHOTO = () => [it('patinho', 150), it('arroz', 180), it('feijao', 100), it('salada', 40)];
function Sheet() {
  const s = useStore(); const sh = s.papp.sheet; const [ob, setOb] = useState([]); const [photo, setPhoto] = useState(null);
  const close = () => set(x => { x.papp.sheet = null; });
  if (sh.step === 'como') return html`<div class="sheet"><h2>Como foi a refeição?</h2><p class="small mut">Escolha o jeito mais rápido para você.</p>
    <button class="pbtn row" style="justify-content:center" onClick=${() => { setPhoto(PHOTO()); set(x => { x.papp.sheet = { step: 'foto' }; }); }}><${Icon} n="camera" /> Tirar foto do prato</button>
    <button class="pbtn" onClick=${() => set(x => { x.papp.sheet = { step: 'obst', st: 'dif' }; })}>Só marcar como diferente</button><button class="btn ghost" onClick=${close}>Cancelar</button></div>`;
  if (sh.step === 'foto') { const L = photo || PHOTO(); const lo = sum(L).kcal * .88, hi = sum(L).kcal * 1.12;
    return html`<div class="sheet"><div class="row sp"><h2>Confira o que encontramos</h2><button class="iconbtn" onClick=${close} aria-label="Fechar"><${Icon} n="x" /></button></div>
      <div class="table-surface" style="padding:8px"><${Plate} L=${L} size=${220} /><span class="illus">Foto simulada</span></div>
      ${L.map((i, n) => html`<div class="row small" style="border-top:1px solid var(--line);padding-top:8px"><${Thumb} k=${i.k} s=${32} /><span class="grow">${short(i.k)}</span>
        <select class="input" style="padding:4px 6px" aria-label=${'Quantidade de ' + short(i.k)} value=${i.g} onChange=${e => { const L2 = [...L]; L2[n] = { ...i, g: +e.target.value }; setPhoto(L2); }}>${[.5, 1, 1.5, 2].map(f => { const g = Math.round(F[i.k].ref * f / 10) * 10; return html`<option value=${g}>${measure({ k: i.k, g }) || g + ' g'}</option>`; })}${![.5, 1, 1.5, 2].some(f => Math.round(F[i.k].ref * f / 10) * 10 === i.g) && html`<option value=${i.g}>${measure(i) || i.g + ' g'}</option>`}</select>
        <button class="iconbtn" aria-label="Remover" onClick=${() => setPhoto(L.filter((_, j) => j !== n))}><${Icon} n="x" s=${14} /></button></div>`)}
      <div class="small" style="background:var(--sunken);border-radius:8px;padding:8px 10px">Estimativa: <b>${fmt(lo)}–${fmt(hi)} kcal</b>. Use óleo ou molho? Isso muda a conta.</div>
      <div class="row wrap" style="gap:6px">${['Sem óleo', 'Pouco óleo', 'Frito'].map((t, n) => html`<button class="chip" aria-pressed=${n === 1}>${t}</button>`)}</div>
      <button class="pbtn primary" onClick=${() => set(x => { x.papp.sheet = { step: 'obst', st: 'dif', photo: L }; })}>Confirmar</button></div>`; }
  return html`<div class="sheet"><h2>O que atrapalhou?</h2><p class="small mut">Opcional. Ajuda a sua nutricionista a ajustar o plano.</p>
    <div class="row wrap" style="gap:6px">${['Fome à noite', 'Trabalho', 'Festa', 'Ansiedade', 'Sem tempo', 'Comi fora', 'Sem comida em casa'].map(o => html`<button class="chip" aria-pressed=${ob.includes(o)} onClick=${() => setOb(ob.includes(o) ? ob.filter(x => x !== o) : [...ob, o])}>${o}</button>`)}</div>
    <button class="pbtn primary" onClick=${() => log(sh.st, { note: ob.join(', '), photo: sh.photo })}>Enviar</button><button class="btn ghost" onClick=${() => log(sh.st, { photo: sh.photo })}>Pular</button></div>`;
}
function PPlano() {
  const s = useStore(); const [open, setOpen] = useState('almoco'); const plan = s.pub[PID];
  return html`<div style="margin-top:6px"><h1>Seu plano</h1><div class="small mut">Versão ${s.ver[PID]} · atualizado pela Marina</div></div>
    ${MEALS.map(([m, n, h]) => html`<div class="pcard" style="padding:0;overflow:hidden"><button class="row" style="width:100%;border:0;background:transparent;padding:12px 14px;text-align:left" onClick=${() => setOpen(open === m ? null : m)}>
      <div style="width:72px;height:54px;flex:none;border-radius:14px;overflow:hidden;background:var(--table-b)">${heroFor(m, plan[m]) ? html`<img src=${A(m + '_hero.webp')} alt="" style="width:100%;height:100%;object-fit:cover;transform:scale(1.25)" />` : html`<${Plate} L=${plan[m]} size=${54} />`}</div><div class="grow"><div style="font-weight:600">${n}</div><div class="small mut">${h} · ${fmt(sum(plan[m]).kcal)} kcal</div></div><${Icon} n="chev" s=${16} /></button>
      ${open === m && html`<div style="padding:0 14px 12px">${heroFor(m, plan[m]) && html`<div class="table-surface hero-wrap" style="margin-bottom:8px"><${Hero} meal=${m} /><button class="btn sm on-photo" onClick=${() => set(x => { x.modal = { type: 'spin', meal: m }; })}><${Icon} n="cube" s=${15} /> Ver em 3D</button></div>`}${plan[m].map(i => html`<div class="row small" style="padding:6px 0;border-top:1px solid var(--line)"><${Thumb} k=${i.k} s=${30} /><span class="grow">${short(i.k)}</span><span class="mut">${measure(i) || i.g + ' g'}</span></div>
        ${subs(i).length > 0 && html`<div class="tiny mut" style="padding:0 0 4px 38px">Pode trocar por: ${subs(i).map(sb => `${short(sb.k).toLowerCase()} (${measure(sb) || sb.g + ' g'})`).join(', ')}</div>`}`)}</div>`}</div>`)}`;
}
function PMarm() {
  const [chk, setChk] = useState({}); const agg = {}; WEEK.forEach(x => x.m.comps.flat().forEach(i => { agg[i.k] = (agg[i.k] || 0) + i.g; }));
  return html`<div style="margin-top:6px"><h1>Marmitas</h1><div class="small mut">Preparo no domingo · 5 almoços</div></div>
    ${WEEK.slice(0, 3).map(x => html`<div class="pcard"><div class="row sp small" style="margin-bottom:6px"><b>${x.d} ${x.dt}</b><span class="mut">${fmt(sum(x.m.comps.flat()).kcal)} kcal</span></div><${Marmita} m=${x.m} small=${true} /><div class="tiny mut" style="margin-top:6px">${x.st}</div></div>`)}
    <div class="pcard"><h3 style="margin-bottom:6px">Lista de compras</h3>${Object.entries(agg).map(([k, g]) => html`<label class="row small" style="padding:6px 0;border-top:1px solid var(--line)"><input type="checkbox" checked=${!!chk[k]} onChange=${() => setChk({ ...chk, [k]: !chk[k] })} /><span class="grow" style=${chk[k] ? 'text-decoration:line-through;color:var(--mut)' : ''}>${short(k)}</span><span class="mut">${g >= 1000 ? fmt(g / 1000, 2) + ' kg' : g + ' g'}</span></label>`)}</div>`;
}
function PProg() {
  const p = pat(PID); const W = weightSeries(p);
  return html`<div style="margin-top:6px"><h1>Progresso</h1></div>
    <div class="pcard"><div class="row sp"><h3>Peso</h3><b>${fmt(p.w1, 1)} kg</b></div><${LineChart} data=${W} labels=${['ago', '', '', 'set', '', '', '', 'out', '', '', '', 'nov']} h=${190} /><div class="small mut">${fmt(p.w1 - p.w0, 1)} kg desde agosto</div></div>
    <div class="pcard"><h3 style="margin-bottom:8px">Hábitos da semana</h3>${[['3 porções de vegetais por dia', 5, 7], ['Jantar antes das 21h', 4, 7], ['Registrar as refeições', 6, 7]].map(([n, a, b]) => html`<div style="margin-top:8px"><div class="row sp small"><span>${n}</span><span class="mut">${a} de ${b} dias</span></div><div class="meter" style="margin-top:4px"><i style=${`width:${a / b * 100}%`}></i></div></div>`)}</div>
    <div class="pcard"><h3 style="margin-bottom:8px">Últimos 28 dias</h3><${Heat} id=${PID} days=${28} /></div>`;
}

/* ------------------------------------------------------------------ 3D / AR (modelos do Blender + mapas de altura) */
const TH = { loader: null, glb: {}, img: {} };
function loadGLB(name) { if (!TH.loader) TH.loader = new THREE.GLTFLoader(); return TH.glb[name] || (TH.glb[name] = new Promise((ok, no) => { const b = atob(window.NUTRI_GLB[name]); const u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); TH.loader.parse(u.buffer, '', g => ok(g.scene), no); })); }
function loadImg(src) { return TH.img[src] || (TH.img[src] = new Promise((ok, no) => { const im = new Image(); im.onload = () => ok(im); im.onerror = no; im.src = src; })); }
async function moundMesh(k, s) {
  const [col, hm] = await Promise.all([loadImg(A(k + '_mound.webp')), loadImg(A(k + '_h.png'))]);
  const c = document.createElement('canvas'); c.width = hm.width; c.height = hm.height; const cx = c.getContext('2d'); cx.drawImage(hm, 0, 0); const D = cx.getImageData(0, 0, c.width, c.height).data;
  const Wd = c.width, Hd = c.height; let hv = new Float32Array(Wd * Hd); for (let i = 0; i < hv.length; i++) hv[i] = D[i * 4] / 255;
  const blur = (a, r) => { const o = new Float32Array(a.length); for (let y = 0; y < Hd; y++) for (let x = 0; x < Wd; x++) { let t = 0, n = 0; for (let k = -r; k <= r; k++) { const xx = x + k; if (xx >= 0 && xx < Wd) { t += a[y * Wd + xx]; n++; } } o[y * Wd + x] = t / n; }
    const o2 = new Float32Array(a.length); for (let y = 0; y < Hd; y++) for (let x = 0; x < Wd; x++) { let t = 0, n = 0; for (let k = -r; k <= r; k++) { const yy = y + k; if (yy >= 0 && yy < Hd) { t += o[yy * Wd + x]; n++; } } o2[y * Wd + x] = t / n; } return o2; };
  hv = blur(blur(hv, 3), 2);
  const N = 110, geo = new THREE.PlaneGeometry(.13, .13, N, N); geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) { const u = uv.getX(i), v = uv.getY(i); const px = Math.min(c.width - 1, Math.round(u * (c.width - 1))), py = Math.min(c.height - 1, Math.round((1 - v) * (c.height - 1))); pos.setY(i, hv[py * Wd + px] * .06 * .9); }
  geo.computeVertexNormals();
  const tex = new THREE.Texture(col); tex.needsUpdate = true; tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 4;
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex, alphaTest: .55, roughness: .75 })); m.scale.setScalar(s); m.castShadow = true; m.receiveShadow = true; m.name = k;
  return m;
}
async function fillBox(k, w, h, d) {
  const im = await loadImg(A(k + (NOFILL[k] ? '_mound' : '_fill') + '.webp')); const t = new THREE.Texture(im); t.needsUpdate = true; t.encoding = THREE.sRGBEncoding;
  const side = new THREE.MeshStandardMaterial({ map: t, color: 0xb8b0a4, roughness: .8 }); const top = new THREE.MeshStandardMaterial({ map: t, roughness: .7 });
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [side, side, top, side, side, side]); m.castShadow = true; m.receiveShadow = true; m.name = k; return m;
}
async function buildScene(spec) {
  const g = new THREE.Group();
  if (spec.kind === 'prato') {
    const pl = (await loadGLB('prato')).clone(true); g.add(pl); pl.traverse(o => { if (o.isMesh) { o.receiveShadow = true; o.castShadow = true; } });
    for (const o of layoutPlate(spec.L)) { const m = await moundMesh(o.i.k, o.s * .72); m.position.set((o.x - .5) * .30, .0045 + (o.i.k === 'aveia' ? .024 : 0), (o.y - .5) * .30); g.add(m); }
  } else {
    const M = spec.M; const sc = Math.cbrt(M.pot / 750); const pot = (await loadGLB('marmita' + M.div)).clone(true); pot.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    const inner = new THREE.Group(); inner.add(pot); const caps = capOf(M.div, 750);
    for (const [ci, [rx, ry, rw, rh]] of CONT['marmita' + M.div].entries()) {
      const c = M.comps[ci] || []; const tot = c.reduce((a, i) => a + i.g / F[i.k].d, 0); if (!tot) continue; const lvl = Math.min(1.15, tot / (caps[ci] * M.pot / 750) ); const H = lvl * .043;
      let x0 = rx * .2 - .1; const W = rw * .2, z0 = ry * .14 - .07, D = rh * .14;
      const pad = .005; for (const [n, i] of c.entries()) { const w = W * (i.g / F[i.k].d) / tot; const l = n === 0 ? pad : 0, r = n === c.length - 1 ? pad : 0; const b = await fillBox(i.k, w - l - r, H, D - 2 * pad); b.position.set(x0 + l + (w - l - r) / 2, .002 + H / 2, z0 + D / 2); inner.add(b); x0 += w; }
    }
    inner.scale.setScalar(sc); g.add(inner);
  }
  return g;
}
function Viewer3D({ spec }) {
  const host = useRef(null); const [st, setSt] = useState('Carregando modelos do Blender…'); const ctx = useRef({}); const [ar, setAr] = useState(null);
  useEffect(() => {
    let raf, alive = true; const el = host.current; if (!window.THREE) { setSt('O 3D não carregou neste navegador.'); return; }
    const r = new THREE.WebGLRenderer({ antialias: true, alpha: true }); r.setPixelRatio(Math.min(2, devicePixelRatio)); r.outputEncoding = THREE.sRGBEncoding; r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = .82;
    el.prepend(r.domElement); const size = () => { r.setSize(el.clientWidth, el.clientHeight); cam.aspect = el.clientWidth / el.clientHeight; cam.updateProjectionMatrix(); };
    const sc = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(32, 1.6, .01, 10); const plate = spec.kind === 'prato';
    cam.position.set(0, plate ? .4 : .34, plate ? .34 : .2); const ctl = new THREE.OrbitControls(cam, r.domElement); ctl.target.set(0, .01, 0); ctl.enableDamping = true; ctl.minDistance = .15; ctl.maxDistance = 1.2; ctl.maxPolarAngle = Math.PI * .48;
    sc.add(new THREE.HemisphereLight(0xffffff, 0xb9b3a8, .6)); const dl = new THREE.DirectionalLight(0xfff6ea, 1.1); dl.position.set(-.35, .8, .45); dl.castShadow = true; dl.shadow.mapSize.set(2048, 2048); Object.assign(dl.shadow.camera, { left: -.35, right: .35, top: .35, bottom: -.35 }); dl.shadow.bias = -.0004; dl.shadow.radius = 4; sc.add(dl);
    const fill = new THREE.DirectionalLight(0xe8f0ff, .35); fill.position.set(.5, .4, -.3); sc.add(fill);
    const gnd = new THREE.Mesh(new THREE.CircleGeometry(1.2, 64), new THREE.ShadowMaterial({ opacity: .16 })); gnd.rotation.x = -Math.PI / 2; gnd.receiveShadow = true; sc.add(gnd);
    size(); const ro = new ResizeObserver(size); ro.observe(el);
    buildScene(spec).then(g => { if (!alive) return; sc.add(g); ctx.current.group = g; setSt(''); }).catch(e => setSt('Não consegui carregar os modelos: ' + e));
    const loop = () => { ctl.update(); r.render(sc, cam); raf = requestAnimationFrame(loop); }; loop();
    return () => { alive = false; cancelAnimationFrame(raf); ro.disconnect(); r.dispose(); el.innerHTML = ''; };
  }, []);
  const openAR = () => {
    const g = ctx.current.group; if (!g || !THREE.GLTFExporter) return; setAr({ msg: 'Gerando o modelo…' });
    new THREE.GLTFExporter().parse(g, glb => { const url = URL.createObjectURL(new Blob([glb], { type: 'model/gltf-binary' })); setAr({ url, msg: 'Carregando visualizador…' }); }, e => setAr({ msg: 'Não consegui gerar o modelo: ' + e }), { binary: true });
  };
  return html`<div class="col" style="gap:0">
    <div class="stage" ref=${host}>${st && html`<div class="loading">${st}</div>`}<span class="hint">Arraste para girar · role ou use dois dedos para aproximar</span></div>
    <div class="row wrap sp" style="padding:12px 16px;border-top:1px solid var(--line)"><span class="small mut">Tamanho real: ${spec.kind === 'prato' ? 'prato raso de 27 cm' : `pote de ${spec.M.pot} ml`}. Representação ilustrativa, não é medição.</span>
      <button class="btn primary" onClick=${openAR}>Ver na mesa (AR)</button></div>
    ${ar && html`<${ARView} ar=${ar} onClose=${() => setAr(null)} />`}
  </div>`;
}
const SPIN_N = 24; const SPIN_OK = { almoco: 1, jantar: 1, cafe: 1, lanche: 1 };
function SpinViewer({ meal, changed }) {
  const [idx, setIdx] = useState(0); const [ready, setReady] = useState(0); const [auto, setAuto] = useState(!RM); const [ar, setAr] = useState(null); const drag = useRef(null);
  const src = i => A('spin/' + meal + '_' + String(i).padStart(2, '0') + '.webp');
  const has = !!SPIN_OK[meal];
  useEffect(() => { if (!has) return; let n = 0; for (let i = 0; i < SPIN_N; i++) { const im = new Image(); im.onload = im.onerror = () => setReady(++n); im.src = src(i); } }, [meal]);
  useEffect(() => { if (!auto || ready < SPIN_N) return; const t = setInterval(() => setIdx(i => (i + 1) % SPIN_N), 110); return () => clearInterval(t); }, [auto, ready]);
  const down = e => { setAuto(false); drag.current = { x: e.clientX, i: idx }; e.currentTarget.setPointerCapture(e.pointerId); };
  const move = e => { if (!drag.current) return; const d = Math.round((e.clientX - drag.current.x) / 14); setIdx(((drag.current.i - d) % SPIN_N + SPIN_N) % SPIN_N); };
  const up = () => { drag.current = null; };
  const openAR = () => {
    setAr({ msg: 'Carregando o modelo 3D…' });
    const go2 = () => { const b = atob(window.NUTRI_AR[meal]); const u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); setAr({ url: URL.createObjectURL(new Blob([u], { type: 'model/gltf-binary' })), msg: 'Carregando visualizador…' }); };
    if (window.NUTRI_AR && window.NUTRI_AR[meal]) return go2();
    const sc = document.createElement('script'); sc.src = 'ar_' + meal + '.js'; sc.onload = go2; sc.onerror = () => setAr({ msg: 'Não consegui carregar o modelo de AR.' }); document.head.appendChild(sc);
  };
  return html`<div class="col" style="gap:0">
    <div class="spin" onPointerDown=${down} onPointerMove=${move} onPointerUp=${up} onPointerCancel=${up}>
      <img src=${has ? src(idx) : A(meal + '_hero.webp')} alt="Prato em 3D" draggable="false" />
      ${has && ready < SPIN_N && html`<div class="loading">Carregando ${Math.round(ready / SPIN_N * 100)}%</div>`}
      <span class="hint">${has ? 'Arraste para girar' : 'Giro em 3D ainda sendo renderizado · use Ver na mesa'}</span>
    </div>
    <div class="row wrap sp" style="padding:12px 16px 16px;gap:10px">
      <div class="row"><button class="iconbtn" aria-label="Girar para a esquerda" onClick=${() => { setAuto(false); setIdx(i => (i + SPIN_N - 1) % SPIN_N); }}><${Icon} n="back" s=${16} /></button>
        <button class="iconbtn" aria-label=${auto ? 'Parar' : 'Girar sozinho'} onClick=${() => setAuto(a => !a)}><${Icon} n=${auto ? 'pause' : 'play'} s=${16} /></button>
        <button class="iconbtn" aria-label="Girar para a direita" onClick=${() => { setAuto(false); setIdx(i => (i + 1) % SPIN_N); }}><${Icon} n="chev" s=${16} /></button></div>
      <span class="small mut grow" style="min-width:180px">${changed ? 'Mostrando a versão publicada do plano. ' : ''}Renderizado no Blender em tamanho real (prato de 27 cm).</span>
      <button class="btn primary" onClick=${openAR}>Ver na mesa (AR)</button></div>
    ${ar && html`<${ARView} ar=${ar} onClose=${() => setAr(null)} />`}
  </div>`;
}
function ARView({ ar, onClose }) {
  const host = useRef(null); const [msg, setMsg] = useState(ar.msg);
  useEffect(() => {
    if (!ar.url) return; const el = host.current;
    const go2 = () => { const mv = document.createElement('model-viewer'); mv.setAttribute('src', ar.url); ['ar', 'camera-controls'].forEach(a => mv.setAttribute(a, '')); mv.setAttribute('ar-modes', 'webxr scene-viewer quick-look'); mv.setAttribute('ar-scale', 'fixed'); mv.setAttribute('shadow-intensity', '1'); mv.setAttribute('alt', 'Modelo 3D');
      const b = document.createElement('button'); b.slot = 'ar-button'; b.className = 'arbtn'; b.textContent = 'Projetar na mesa'; mv.appendChild(b); el.appendChild(mv);
      mv.addEventListener('load', () => setMsg(mv.canActivateAR ? 'Toque em “Projetar na mesa” e aponte o celular para a mesa.' : 'Este aparelho ou esta janela não liberou a câmera para AR. Abra o link do protótipo no navegador do celular para projetar; aqui o modelo gira em 3D.')); };
    if (customElements.get('model-viewer')) go2(); else { const sc = document.createElement('script'); sc.type = 'module'; sc.src = 'https://cdn.jsdelivr.net/npm/@google/model-viewer@3.4.0/dist/model-viewer.min.js'; sc.onload = () => customElements.whenDefined('model-viewer').then(go2); sc.onerror = () => setMsg('O visualizador de AR não carregou.'); document.head.appendChild(sc); }
    return () => { el.innerHTML = ''; };
  }, [ar.url]);
  return html`<div class="modal-bg" style="z-index:70" onClick=${e => e.target === e.currentTarget && onClose()}><div class="modal"><div class="modal-h"><h2 class="grow">Ver na mesa</h2><button class="btn" onClick=${onClose}>Fechar</button></div>
    <div class="stage" ref=${host}></div><div class="small mut" style="padding:12px 16px">${msg}</div></div></div>`;
}


/* ------------------------------------------------------------------ identidade visual */
function Brand() {
  const sw = [['Verde-noite', '#0D1210', 'Fundo de tudo. Escuro e calmo, deixa a comida em primeiro plano.', '#f0f3ec'], ['Lima', '#D3F15B', 'A única cor de ação: botões, progresso, “como planejado”.', '#141a0c'],
    ['Creme', '#EEEBDF', 'O que fazer agora: a próxima refeição, a etiqueta da marmita.', '#1b201d'], ['Laranja', '#FF7A3C', 'Apoio e atenção: proteína, primeira consulta, notificações.', '#1a0e06'],
    ['Lavanda', '#B8A6FF', 'Gordura nos gráficos e informações neutras.', '#17122e'], ['Coral', '#FF6A5C', 'Só para alerta: pulou a refeição, passou da borda.', '#1a0806']];
  const L = S.plans.ana.almoco;
  return html`<div class="main"><div class="main-in">
    <div class="pagehead"><div><div class="eyebrow">Identidade visual · proposta</div><h1 style="font-size:40px;margin-top:4px">nutri</h1><div class="sub">Nome provisório. Comida de verdade em primeiro plano, interface escura e calma, uma cor de ação só.</div></div></div>
    <div class="grid g3">
      <div class="card" style="display:grid;place-items:center;min-height:220px"><${Logo} s=${44} /></div>
      <div class="card" style="display:grid;place-items:center;min-height:220px;background:var(--lime)"><span class="brand" style="color:var(--lime-ink);font-size:30px"><${Mark} s=${44} bg="#141a0c" fg="#d3f15b" />nutri</span></div>
      <div class="card cream" style="display:grid;place-items:center;min-height:220px"><div class="row" style="gap:18px"><div style="width:92px;height:92px;border-radius:24px;background:#0d1210;display:grid;place-items:center"><${Mark} s=${60} /></div><div style="width:92px;height:92px;border-radius:24px;background:#d3f15b;display:grid;place-items:center"><${Mark} s=${60} bg="#141a0c" fg="#d3f15b" /></div></div></div>
    </div>
    <div class="card"><div class="card-h"><h2>O símbolo</h2></div><div class="card-b grid g2" style="align-items:center">
      <p class="small" style="color:var(--ink-2);max-width:60ch">Um prato visto de cima, dividido pelo método do prato: metade de vegetais, um quarto de proteína, um quarto de carboidrato. É a ideia do produto inteira num círculo e funciona do ícone do app até o carimbo na etiqueta da marmita.</p>
      <div class="row" style="gap:20px;justify-content:center">${[64, 40, 24, 16].map(n => html`<${Mark} s=${n} />`)}</div></div></div>
    <div class="card"><div class="card-h"><h2>Cores</h2><span class="small mut">uma cor de ação, o resto é apoio</span></div><div class="card-b grid" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr))">
      ${sw.map(([n, h, d, ink]) => html`<div class="swatch" style=${`background:${h};color:${ink};${h === '#0D1210' ? 'box-shadow:inset 0 0 0 1px #333d38' : ''}`}><b>${n}</b><span>${h}</span><span style="opacity:.85;margin-top:6px;font-size:12.5px;line-height:1.35">${d}</span></div>`)}</div>
      <div class="card-b" style="padding-top:0"><div class="small mut" style="margin-bottom:8px">Nutrientes nos gráficos</div><div class="legend" style="font-size:13.5px;color:var(--ink-2)"><span><i style="background:var(--lime)"></i>Energia</span><span><i style="background:var(--prot)"></i>Proteína</span><span><i style="background:var(--carb)"></i>Carboidrato</span><span><i style="background:var(--fat)"></i>Gordura</span></div></div></div>
    <div class="grid g2">
      <div class="card"><div class="card-h"><h2>Tipografia</h2></div><div class="card-b col" style="gap:14px">
        <div><div class="eyebrow">Títulos e números · Urbanist</div><div class="disp" style="font-size:52px;font-weight:800;line-height:1;letter-spacing:-.03em;margin-top:6px">Oi, Ana!</div><div class="disp" style="font-size:40px;font-weight:700;letter-spacing:-.03em">1.437 <span class="mut" style="font-size:20px">/ 1.800 kcal</span></div></div>
        <div><div class="eyebrow">Texto · Manrope</div><p style="margin-top:6px;color:var(--ink-2);max-width:52ch">Arroz, feijão, frango grelhado e salada. Toque em “Trocar” para ver as opções que a sua nutricionista aprovou.</p></div></div></div>
      <div class="card"><div class="card-h"><h2>Componentes</h2></div><div class="card-b col" style="gap:16px">
        <div class="row wrap"><button class="btn primary">Comi como planejado</button><button class="btn">Comi diferente</button><button class="iconbtn" aria-label="Exemplo"><${Icon} n="plus" s=${16} /></button></div>
        <div class="seg"><button aria-pressed="true">Dia</button><button>Semana</button><button>Mês</button></div>
        <div class="row wrap"><${Pill} k="ok"><span class="dot"></span>como planejado<//><${Pill} k="warn">diferente<//><${Pill} k="bad">pulou<//><${Pill} k="info">mensagem<//></div>
        <div class="ptabs" style="position:static;width:max-content;gap:6px"><button aria-current="page" aria-label="Hoje"><${Icon} n="hoje" s=${22} /></button><button aria-label="Plano"><${Icon} n="plano" s=${22} /></button><button aria-label="Marmitas"><${Icon} n="marmita" s=${22} /></button><button aria-label="Progresso"><${Icon} n="progresso" s=${22} /></button></div>
      </div></div>
    </div>
    <div class="grid g2">
      <div class="card cream"><div class="card-b col" style="padding-top:20px"><div class="row sp"><div><div class="eyebrow" style="color:var(--cream-mut)">Próxima refeição</div><h2 style="font-size:22px">Almoço</h2></div><div class="disp" style="font-size:24px;font-weight:800">12:30</div></div>
        <div class="table-surface hero-wrap"><${Hero} meal="almoco" /></div><button class="pbtn primary">Comi como planejado</button></div></div>
      <div class="card"><div class="card-h"><h2>Princípios</h2></div><div class="card-b col" style="gap:14px">
        ${[['A comida é a imagem principal', 'Pratos e marmitas renderizados no Blender ocupam o espaço que outros apps dão a ilustrações genéricas.'], ['Lima só para agir e avançar', 'Se está em lima, dá para tocar ou mostra progresso. Nada decorativo usa essa cor.'], ['Creme para o que é agora', 'O cartão da próxima refeição e a etiqueta da marmita são creme, o resto é escuro.'], ['Pílulas e círculos', 'Botões em pílula, navegação em círculos, cards com cantos de 22 px. Nada de bordas finas separando tudo.']].map(([t, d]) => html`<div class="row" style="align-items:flex-start;gap:12px"><${Mark} s=${22} /><div><b class="disp" style="font-size:16px">${t}</b><div class="small mut">${d}</div></div></div>`)}
      </div></div>
    </div>
  </div></div>`;
}

/* ------------------------------------------------------------------ modais */
function Modal() {
  const s = useStore(); const md = s.modal; if (!md) return null;
  const close = () => set(x => { x.modal = null; });
  let title, body;
  if (md.type === 'spin') { title = MEALS.find(x => x[0] === md.meal)[1] + ' em 3D'; body = html`<${SpinViewer} meal=${md.meal} changed=${md.changed} />`; }
  if (md.type === '3d') { title = md.kind === 'prato' ? 'Prato em 3D' : 'Marmita em 3D'; body = html`<${Viewer3D} spec=${md} />`; }
  if (md.type === 'publicar') { const ch = diffPlans(s.pub[md.pid], s.plans[md.pid]); title = `Publicar plano v${s.ver[md.pid] + 1}`;
    body = html`<div class="card-b col"><p class="small mut">O que muda para ${pat(md.pid).n.split(' ')[0]} em relação à versão ${s.ver[md.pid]}:</p><div class="diff">${ch.map(([k, t]) => html`<div class=${k}>${t}</div>`)}</div>
      <div class="row" style="justify-content:flex-end"><button class="btn" onClick=${close}>Cancelar</button><button class="btn primary" onClick=${() => { set(x => { x.pub[md.pid] = clone(x.plans[md.pid]); x.ver[md.pid]++; x.modal = null; }); toast(`Plano v${S.ver[md.pid]} enviado para o app de ${pat(md.pid).n.split(' ')[0]}`); }}>Publicar e avisar a paciente</button></div></div>`; }
  if (md.type === 'apresentar') { const plan = s.plans[md.pid]; title = 'Plano do dia'; body = html`<div class="card-b col" style="gap:16px"><div class="grid g4" style="gap:12px">${MEALS.map(([m, n, h]) => html`<div class="col" style="align-items:center;text-align:center;gap:4px"><div class="table-surface hero-wrap" style="width:100%">${heroFor(m, plan[m]) ? html`<${Hero} meal=${m} />` : html`<${Plate} L=${plan[m]} />`}</div><b>${n}</b><span class="small mut">${h} · ${fmt(sum(plan[m]).kcal)} kcal</span></div>`)}</div>
    <div class="row" style="gap:14px"><${QR} seed=${4242} /><div><b>Aponte a câmera para receber o plano no celular</b><div class="small mut">Abre direto no app, sem senha. QR ilustrativo.</div></div></div></div>`; }
  return html`<div class="modal-bg" onClick=${e => e.target === e.currentTarget && close()}><div class="modal" role="dialog" aria-label=${title}><div class="modal-h"><h2 class="grow">${title}</h2><button class="btn" onClick=${close}>Fechar</button></div>${body}</div></div>`;
}

/* ------------------------------------------------------------------ tema */
const sysLight = () => !!(window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches);
const curTheme = () => document.documentElement.getAttribute('data-theme') || (sysLight() ? 'light' : 'dark');
try { const t = localStorage.getItem('nutri-theme'); if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t); } catch (e) {}
function ThemeBtn() {
  const [t, setT] = useState(curTheme());
  const flip = () => { const n = curTheme() === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', n); try { localStorage.setItem('nutri-theme', n); } catch (e) {} setT(n); };
  return html`<button class="iconbtn" style="width:38px;height:38px;flex:none" onClick=${flip} aria-label=${t === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'} title=${t === 'dark' ? 'Tema claro' : 'Tema escuro'}><${Icon} n=${t === 'dark' ? 'sun' : 'moon'} s=${18} /></button>`;
}

/* ------------------------------------------------------------------ app */
function Nutri() { const s = useStore(); return html`<div class="shell"><${Side} /><main class="main">
  ${s.page === 'hoje' && html`<${Today} />`}${s.page === 'agenda' && html`<${Agenda} />`}${s.page === 'pacientes' && html`<${Patients} />`}${s.page === 'paciente' && html`<${PatientPage} />`}${s.page === 'mensagens' && html`<${Messages} />`}${s.page === 'alimentos' && html`<${Foods} />`}
</main></div>`; }
function App() {
  const s = useStore();
  const setMode = m => { set(x => { x.mode = m; }); history.replaceState(null, '', '#' + (m === 'nutri' ? (S.page === 'paciente' ? 'paciente-' + S.pid : S.page) : m === 'paciente' ? 'app-paciente' : m === 'marca' ? 'identidade' : 'lado-a-lado')); };
  useEffect(() => { const k = e => { if (e.key === 'Escape') set(x => { x.modal = null; x.papp.sheet = null; }); }; addEventListener('keydown', k); return () => removeEventListener('keydown', k); }, []);
  return html`
    <header class="topbar"><${Logo} />
      <div class="seg" role="group" aria-label="Visão">${[['nutri', 'Nutricionista', 'Nutri'], ['paciente', 'App do paciente', 'Paciente'], ['lado', 'Lado a lado', 'Juntos'], ['marca', 'Identidade visual', 'Marca']].map(([k, n, m]) => html`<button aria-pressed=${s.mode === k} onClick=${() => setMode(k)}><span class="lg">${n}</span><span class="sm">${m}</span></button>`)}</div>
      <span class="demo-note themebtn">Protótipo · dados fictícios</span><${ThemeBtn} /></header>
    ${s.mode === 'nutri' && html`<${Nutri} />`}
    ${s.mode === 'marca' && html`<${Brand} />`}
    ${s.mode === 'paciente' && html`<div class="patient-only"><div class="phone-wrap"><${PatientApp} /></div></div>`}
    ${s.mode === 'lado' && html`<div class="main"><div class="main-in"><div class="pagehead"><div><h1>Paciente e nutricionista ao mesmo tempo</h1><div class="sub">Registre uma refeição no celular da Ana e veja o painel da Marina mudar.</div></div></div>
      <div class="side-by-side"><div class="phone-wrap"><${PatientApp} /></div><div><${Today} /></div></div></div></div>`}
    <${Modal} />
    ${s.toast && html`<div class="toast" role="status">${s.toast}</div>`}`;
}
function fromHash() { const h = location.hash.slice(1); set(x => {
  if (h === 'app-paciente') x.mode = 'paciente'; else if (h === 'lado-a-lado') x.mode = 'lado'; else if (h === 'identidade') x.mode = 'marca';
  else if (h.startsWith('paciente-') && pat(h.slice(9).split('-')[0])) { const [id, tb] = h.slice(9).split('-'); x.mode = 'nutri'; x.page = 'paciente'; x.pid = id; x.ptab = ['resumo', 'plano', 'marmitas', 'evolucao', 'registros'].includes(tb) ? tb : 'resumo'; }
  else if (NAV.some(n => n[0] === h)) { x.mode = 'nutri'; x.page = h; } }); }
addEventListener('hashchange', fromHash); fromHash();
render(html`<${App} />`, document.getElementById('app'));
window.__nutriDemo = { open3d: kind => set(x => { x.modal = kind === 'prato' ? { type: 'spin', meal: 'almoco' } : { type: '3d', kind: 'marmita', M: JSON.parse(JSON.stringify(x.marm)) }; }) };
})();
