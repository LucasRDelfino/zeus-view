// utils/cidadeParaUF.js
export const cidadeParaUF = {
  'são paulo': 'SP',
  'sao paulo': 'SP',
  'rio de janeiro': 'RJ',
  'belo horizonte': 'MG',
  'brasília': 'DF',
  'salvador': 'BA',
  'fortaleza': 'CE',
  'curitiba': 'PR',
  'recife': 'PE',
  'manaus': 'AM',
  'porto alegre': 'RS',
  'goiânia': 'GO',
  'belém': 'PA',
  'guarulhos': 'SP',
  'campinas': 'SP',
  'são luís': 'MA',
  'sao luis': 'MA',
  'maceió': 'AL',
  // Adicione outras cidades conforme necessário
};

export const getUFByCidade = (cidade) => {
  const cidadeLower = cidade.toLowerCase();
  return cidadeParaUF[cidadeLower] || null;
};