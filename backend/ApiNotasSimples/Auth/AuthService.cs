using ApiCadastroClientes.Data.Repositories;
using ApiCadastroClientes.Models.DTO;
using ApiNotasSimples.Models;
using Microsoft.Extensions.Logging;

namespace ApiCadastroClientes.Services
{
    public class AuthService
    {
        private readonly UsuarioRepository _repo;
        private readonly CryptoService _cryptoService;
        private readonly ILogger<AuthService> _logger;

        public AuthService(UsuarioRepository repo, CryptoService cryptoService, ILogger<AuthService> logger)
        {
            _repo = repo ?? throw new ArgumentNullException(nameof(repo));
            _cryptoService = cryptoService ?? throw new ArgumentNullException(nameof(cryptoService), "CryptoService não injetado");
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // CADASTRAR
        public async Task<UsuarioModel> Cadastrar(UsuarioDTO dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "Dados do usuário não podem ser nulos.");

            var usuarioExistente = await _repo.BuscarPorEmail(dto.Email);
            if (usuarioExistente != null)
                throw new Exception("E-mail já cadastrado!");

            var usuario = new UsuarioModel()
            {
                Nome = dto.Nome,
                Email = dto.Email,
                Senha = _cryptoService.HashPassword(dto.Senha), 
                Endereco = dto.Endereco,
                Cpf = dto.Cpf,
                Telefone = dto.Telefone
            };

            await _repo.Adicionar(usuario);

            _logger.LogInformation("Usuário cadastrado com ID: {Id}", usuario.Id);

            return usuario;
        }

        // LOGAR
        public async Task<UsuarioModel?> Logar(LoginDTO login)
        {
            if (login == null)
                throw new ArgumentNullException(nameof(login), "Dados de login não podem ser nulos.");

            var usuario = await _repo.BuscarPorEmail(login.Email);
            if (usuario != null)
            {
                _logger.LogDebug("Usuário encontrado: {Email}, Senha: {Senha}", usuario.Email, usuario.Senha ?? "null");

                if (!string.IsNullOrEmpty(usuario.Senha) && _cryptoService.VerifyPassword(login.Senha, usuario.Senha))
                {
                    _logger.LogInformation("Login bem-sucedido para e-mail: {Email}", login.Email);
                    return usuario;
                }

                _logger.LogWarning("Senha inválida para e-mail: {Email}", login.Email);
            }
            else
            {
                _logger.LogWarning("Nenhum usuário encontrado para e-mail: {Email}", login.Email);
            }

            return null;
        }
    }
}
