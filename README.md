# carboneTransformAPI
API para geração de documentos

# Descrição
A API gera um documento com o formato informado e de acordo com o template. 
<br> Os dados são informados via POST juntamento com o template.
<br> A API realiza a transformação e habilita o download do documento.

# Instruções
1 - Instalar as dependências do projeto
<br> npm install
<br> 2 - Executar a aplicação
<br> node index.js

# API - Documentação
O ponto de entrada da API:
<br>
<br> http://[nome do servidor]:[porta]/api/v1/documento/[tipo do documento]
<br>
<br> Exemplo: <span style="font-style:italic"> http://localhost:8081/api/v1/documento/docx </span>
<br>
<br> Os dados a serem enviados para a API são:
<br> Arquivo template e JSON ou Formulário com os dados a serem inseridos no template
<br> O formulário deve ter a propriedade <b>enctype="multipart/form-data"</b>
<br>
<br> <b> IMPORTANTE! </b>
<br> A propriedade NAME do campo file no formulário deve ser igual a 'documento', caso contrário a API não irá identificar o arquivo que foi feito o upload. 
<br> Exemplo:  <b> input type="file" name="documento" </b>
<br>
<br> Na pasta <b>'teste'</b> tem um formulário de exemplo para realizar testes e tem também um arquivo template chamado simple.odt de exemplo.