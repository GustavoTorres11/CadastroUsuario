using ApiCadastroClientes.Data.Repositories;
using ApiCadastroClientes.Models.DTO;
using ApiNotasSimples.Models;
using ApiNotasSimples.Models.DTO;

namespace ApiNotasSimples.Services
{
    public class ClienteService
    {
        private readonly UsuarioRepository _repo;

        public ClienteService(UsuarioRepository repo)
        {
            _repo = repo;
        }

        //esse método add um novo usuário e o retorna com o ID gerado
        public async Task<UsuarioModel> Adicionar(UsuarioDTO dto)
        {
            var cliente = new UsuarioModel
            {
                Nome = dto.Nome,
                Email = dto.Email,
                Telefone = dto.Telefone,
                Cpf = dto.Cpf,
                Endereco = dto.Endereco
            };

            var novoCliente = await _repo.Adicionar(cliente);
            return novoCliente;
        }

        // esse método busca um usuário pelo email e senha, retornando o usuário se encontrado
        public Task<List<UsuarioResult>> Listar()
        {
            return _repo.ListarTodos();
        }
    }
}