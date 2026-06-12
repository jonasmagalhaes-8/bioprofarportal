const fs = require('fs');
const path = require('path');

const dir = '/Users/inova/Documents/GitHub/Bioprofar Portal + Back-end/BioProFar Portal/src/app/controllers';

const mapping = {
  'apoios': 'apoio',
  'artigos': 'artigo',
  'configuracao': 'configuracaosite',
  'equipes': 'equipe',
  'financiadores': 'financiador',
  'carrossel-imagens': 'imagemcarrossel',
  'membros-equipe': 'membroequipe',
  'noticias': 'noticia',
  'portfolios': 'portfolio',
  'secoes-custom': 'secaocustom'
};

const files = fs.readdirSync(dir).filter(f => f.endsWith('Controller.ts'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  for (const [plural, singular] of Object.entries(mapping)) {
    // GET: /plural -> /singular/listar
    content = content.replace(new RegExp(`apiBackend\\.get(.*?)<.*?>(.*?)\\('/${plural}'\\)`, 'g'), `apiBackend.get$1$2('/${singular}/listar')`);
    
    // POST: /plural -> /singular/salvar
    content = content.replace(new RegExp(`apiBackend\\.post(.*?)<.*?>(.*?)\\('/${plural}'(.*)\\)`, 'g'), `apiBackend.post$1$2('/${singular}/salvar'$3)`);
    
    // PUT with id: /plural/${id} -> /singular/atualizar
    content = content.replace(new RegExp(`apiBackend\\.put(.*?)<.*?>(.*?)\\(\`/${plural}/\\$\\{.*?\\}\`(.*)\\)`, 'g'), `apiBackend.put$1$2('/${singular}/atualizar'$3)`);
    
    // PUT without id: /plural -> /singular/atualizar
    content = content.replace(new RegExp(`apiBackend\\.put(.*?)<.*?>(.*?)\\('/${plural}'(.*)\\)`, 'g'), `apiBackend.put$1$2('/${singular}/atualizar'$3)`);

    // PUT list: /plural/ordem -> /singular/atualizar
    content = content.replace(new RegExp(`apiBackend\\.put(.*?)<.*?>(.*?)\\('/${plural}/ordem'(.*)\\)`, 'g'), `apiBackend.put$1$2('/${singular}/atualizar'$3)`);
    
    // DELETE: /plural/${id} -> /singular/deletar/${id}
    content = content.replace(new RegExp(`apiBackend\\.delete(.*?)<.*?>(.*?)\\(\`/${plural}/(.*?)\`\\)`, 'g'), `apiBackend.delete$1$2(\`/${singular}/deletar/$3\`)`);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${file}`);
  }
}
