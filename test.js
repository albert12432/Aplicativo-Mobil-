const QUIZ_DATA_GRAMMAR = [
  { level: 'A1', category: 'Verbos Comunes', question: "¿Qué verbo significa 'comer' en español?", options: ['To drink', 'To eat', 'To sleep', 'To read'], answer: 'To eat' },
  { level: 'A2', category: 'Conectores', question: "Ella estaba cansada, ___ siguió trabajando.", options: ['because', 'although', 'so', 'if'], answer: 'although' },
  { level: 'A2', category: 'Verbos Comunes', question: "El pasado simple de 'go' es:", options: ['goed', 'went', 'gone', 'going'], answer: 'went' },
  { level: 'A2', category: 'Conectores', question: "Quiero estudiar medicina, ___ tengo que aprobar el ICFES.", options: ['but', 'therefore', 'or', 'while'], answer: 'therefore' },
  { level: 'A1', category: 'Verbos Comunes', question: "La forma correcta de decir 'él tiene' es:", options: ['He have', 'He has', 'He having', 'He is have'], answer: 'He has' },
];

const READING_TEXT = "The city council announced a new initiative today to reduce traffic congestion. Starting next month, all public transport will be free during peak hours (7 AM to 9 AM and 5 PM to 7 PM) on weekdays. This measure is an attempt to encourage commuters to leave their private vehicles at home. However, critics argue that the city's bus fleet is currently insufficient to handle the expected increase in passengers, potentially leading to overcrowding and delays. The council has promised to add fifty new buses to the service by the end of the year, but many citizens remain skeptical until they see the improvement.";

const QUIZ_DATA_READING = [
  { level: 'B1', category: 'Comprensión Lectora', question: "El objetivo principal de la nueva iniciativa es:", options: ['Reducir el costo del transporte público.', 'Aumentar la flota de autobuses.', 'Disminuir la congestión vehicular.', 'Extender los horarios pico.'], answer: 'Disminuir la congestión vehicular.', text: READING_TEXT },
  { level: 'B1', category: 'Comprensión Lectora', question: "Según el texto, el transporte público será gratuito:", options: ['Solo los fines de semana.', 'Solo en las horas valle.', 'Durante las horas de mayor tráfico.', 'Todo el día, todos los días.'], answer: 'Durante las horas de mayor tráfico.', text: READING_TEXT },
  { level: 'B2', category: 'Vocabulario Contextual', question: "En el contexto, ¿qué significa 'skeptical'?", options: ['Entusiasmado', 'Optimista', 'Dudoso', 'Apoyado'], answer: 'Dudoso', text: READING_TEXT },
];
window.QUIZ_DATA = {
  grammar: QUIZ_DATA_GRAMMAR,
  reading: QUIZ_DATA_READING
};