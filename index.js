const express = require('express'); //importa a framework express, permite criação e gerenciamento do servidor
const app = express(); //cria a instância do servidor que vai configurar as rotas e middlewares
const pool = require('./db'); //import o pool para usar/gerenciar a conexão com o banco

//é essencial para que o Express entenda e possa manipular os dados de requisições POST ou PUT
app.use(express.json()); //Middleware - analisa o corpo da requisição e converte num objeto JSON

// Rota para buscar todas as tarefas
app.get('/tarefas', async (_, res)=>{
try{
    const tarefas = await pool.query('SELECT * FROM tb_task'); // Consultando todas as tarefas
    res.status(200).json(tarefas.rows);
} catch(err) {
    console.error('Erro ao buscar tarefas:', err);
    res.status(500).json({ error: 'Erro ao buscar as tarefas' });
}
});

// Rota para buscar todas os usuarios
app.get('/usuarios', async(_, res)=>{
try{
    const usuarios = await pool.query('SELECT * FROM tb_user'); // Consultando todas as tarefas
    res.status(200).json(usuarios.rows);
} catch(err) {
    console.error('Erro ao buscar usuarios:', err);
    res.status(500).json({ error: 'Erro ao buscar as usuarios' });
}
});


// Rota para criar una nova tarefa
app.post('/tarefas', async (req, res) => {
//dados que o cliente enviou para criar novo tarefa
const {title, description, status, user_id} = req.body;
try {
    const tarefas = await pool.query(
//insere os valores recebidos na tabela e retorna todos os campos da nova tarefa
//151, 52, 53, 54) são placeholders usados para passar valores para a query de forma segura, exitando a injeção de SQL

'INSERT INTO tb_task (title, description, status, user_id) VALUES ($1, $2, $3, $4) RETURNING *',

// array contén es valores que serão passados como parametros para a query e são colocados nas pesições correspondentes e VALUES
[title, description, status, user_id]
);
res.status(201).json(tarefas.rows[0]);// Retorna a nova tarefa criada
} catch (err) {
console.error('Erro ao criar tarefa:', err);
res.status(500).json({ error: 'Erro ao criar a tarefa'});
}
});

// Rota para criar um novo usuário
app.post('/usuarios', async (req, res) => {
    const { name, email } = req.body; // pega os dados do corpo da requisição
    try {
        const usuarios = await pool.query(
            'INSERT INTO tb_user (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );
        res.status(201).json(usuarios.rows[0]); // retorna o novo usuário criado
    } catch (err) {
        console.error('Erro ao criar usuário:', err);
        res.status(500).json({ error: 'Erro ao criar o usuário' });
    }
});


// Rota para atualizar uma tarefa existente
app.put('/tarefas/:id', async (req, res) => {
const {id} = req.params; // Pega o id da tarefa da URL
const { title, description, status, user_id} = req.body; // Pega os dados atualizados do corpo da requisição
try {
    const tarefas = await pool.query(
    'UPDATE tb_task SET title = $1, description = $2, status = $3, user_id = $4 WHERE id = $5 RETURNING *',
    [title, description, status, user_id, id]
);
    if (tarefas.rowCount === 0) { // significa que não há nenhuma tarefa com o ID fornecido.
        return res.status(404).json({ error: 'Tarefa não encontrada' }); // Caso a tarefa não seja encontrada
}
    res.status(200).json(tarefas.rows[0]); // Retorna a tarefa atualizada
} catch (err) {
console.error('Erro ao atualizar tarefa:', err);
res.status(500).json({ error: 'Erro ao atualizar a tarefa' });
}
});

// Rota para atualizar um usuário existente
app.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params; // pega o id da URL
    const { name, email } = req.body; // pega os novos dados do corpo da requisição
    try {
        const usuarios = await pool.query(
            'UPDATE tb_user SET name = $1, email = $2 WHERE id = $3 RETURNING *',
            [name, email, id]
        );
        if (usuarios.rowCount === 0) { // se não encontrar usuário com esse id
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json(usuarios.rows[0]); // retorna o usuário atualizado
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err);
        res.status(500).json({ error: 'Erro ao atualizar o usuário' });
    }
});


// Rota para excluir uma tarefa
app.delete('/tarefas/:id', async (req, res) => {
const {id} = req.params; // Pega o id da tarefa da URL

try {
    const tarefas = await pool.query('DELETE FROM tb_task WHERE id = $1 RETURNING *', [id]);
    if (tarefas.rowCount === 0) { // significa que não há nenhuma tarefa com o ID fornecido.
        return res.status(404).json({ error: 'Tarefa não encontrada' }); // Caso a tarefa não seja encontrada
    }

    res.status(200).json({message: 'Tarefa excluída com sucesso' }); //Retorna a mensagem de sucesso
    } catch (err) {
console.error ('Erro ao excluir tarefa:', err);
res.status(500).json({ error: 'Erro ao excluir a tarefa' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Rota para excluir um usuário
app.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params; // pega o id da URL
    try {
        const usuarios = await pool.query(
            'DELETE FROM tb_user WHERE id = $1 RETURNING *',
            [id]
        );
        if (usuarios.rowCount === 0) { // se não encontrar usuário com esse id
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json({ message: 'Usuário excluído com sucesso' });
    } catch (err) {
        console.error('Erro ao excluir usuário:', err);
        res.status(500).json({ error: 'Erro ao excluir o usuário' });
    }
});