const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      filelist.push(dirFile);
    }
  });
  return filelist;
}

const files = walkSync('/Users/inova/Documents/GitHub/Bioprofar Portal + Back-end/bioProFarDevBackEnd/src/main/java/com/bioprofar/bioProFar/Controller');

for (const file of files) {
  if (!file.endsWith('Controller.java')) continue;
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // We want to replace:
  // return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseModel("Registro não encontrado"));
  // with:
  // return ResponseEntity.status(HttpStatus.CREATED).body(new ResponseModel(repository.save(model), "{EntityName} salvo com sucesso"));
  
  // To do this, we'll find the method @PutMapping("/atualizar") and the entity name from the 'atualizado com sucesso' message.
  
  content = content.replace(/@PutMapping\("\/atualizar"\)[\s\S]*?public ResponseEntity<ResponseModel> atualizar\(@RequestBody\s+([A-Za-z0-9_]+)\s+model\) \{[\s\S]*?if\s*\(model\.getId\(\)\s*!=\s*null\s*&&\s*repository\.existsById\(model\.getId\(\)\)\)\s*\{[\s\S]*?return ResponseEntity\.ok\(new ResponseModel\(repository\.save\(model\),\s*"([^"]+) atualizado com sucesso"\)\);[\s\S]*?\}[\s\S]*?return ResponseEntity\.status\(HttpStatus\.NOT_FOUND\)\.body\(new ResponseModel\("Registro não encontrado"\)\);/g, 
  (match, modelClass, entityName) => {
    return `@PutMapping("/atualizar")
    public ResponseEntity<ResponseModel> atualizar(@RequestBody ${modelClass} model) {
        if(model.getId() != null && repository.existsById(model.getId())) {
            return ResponseEntity.ok(new ResponseModel(repository.save(model), "${entityName} atualizado com sucesso"));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(new ResponseModel(repository.save(model), "${entityName} salvo com sucesso"));`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
