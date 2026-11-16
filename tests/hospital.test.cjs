const test = require('node:test');
const assert = require('node:assert/strict');
const H = require('../hospital-data.js');
const state = () => ({version:1,name:'Ana',group:'1 DAW',started:Date.now()-10000,finished:null,stage:0,results:{},drafts:{},hints:[],reflection:''});
const result = q => ({answer:q.answer,hint:false,repaired:false});
test('60 minutos, 32 test y solo tres reparaciones de una palabra',()=>{
  assert.equal(H.stages.reduce((sum,s)=>sum+s.minutes,0),60);
  assert.equal(H.questions.length,35);
  assert.equal(H.questions.filter(q=>q.options).length,32);
  assert.equal(H.questions.filter(q=>q.stage===4).length,8);
  for(const q of H.questions){
    assert.equal(H.validAnswer(q,q.answer),true,q.title);
    assert.equal(H.correct(q,q.answer),true);
    assert.ok(q.prompt && q.explanation && q.hint && H.sources[q.topic]);
  }
});
test('las palabras de código respetan mayúsculas y solo ignoran espacios exteriores',()=>{
  const q=H.questions.find(q=>q.answer==='Number');
  assert.ok(H.correct(q,' Number '));
  assert.equal(H.correct(q,'number'),false);
  assert.equal(H.validAnswer(q,'   '),false);
  assert.equal(H.validAnswer(H.questions[0],'99'),false);
});
test('simulacro separado de diagnóstico y práctica; no cambia el primer resultado',()=>{
  const results=Object.fromEntries(H.questions.map(q=>[q.id,result(q)]));
  assert.equal(H.summary(results,4).grade,10);
  const q=H.questions.find(q=>q.stage===4);
  results[q.id]={answer:String((Number(q.answer)+1)%3),hint:false,repaired:true};
  assert.equal(H.summary(results,4).grade,8.75);
  assert.equal(H.summary(results,0).right,6);
  assert.equal(H.summary({}).answered,0);
});
test('recuperación valida progreso, respuestas y entrega atómica del simulacro',()=>{
  const s=state();assert.ok(H.validState(s));
  s.stage=4;assert.equal(H.validState(s),false);
  H.questions.filter(q=>q.stage<4).forEach(q=>s.results[q.id]=result(q));
  assert.ok(H.validState(s));
  const qs=H.questions.filter(q=>q.stage===4);
  s.results[qs[0].id]=result(qs[0]);assert.equal(H.validState(s),false);
  qs.forEach(q=>s.results[q.id]=result(q));assert.ok(H.validState(s));
  s.stage=5;s.reflection='Revisaré los límites de edad y las conversiones de texto a número.';s.finished=Date.now();assert.ok(H.validState(s));
  s.results[qs[0].id].answer='99';assert.equal(H.validState(s),false);
});
test('rechaza guardados corruptos sin confiar en valores de puntuación',()=>{
  for(const value of [null,{},[],{...state(),drafts:[]},{...state(),started:Date.now()+99999},{...state(),hints:[999]},{...state(),name:''},{...state(),finished:Date.now()}])assert.ok(!H.validState(value));
});
