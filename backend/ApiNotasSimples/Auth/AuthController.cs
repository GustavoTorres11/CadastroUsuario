using ApiCadastroClientes.Models.DTO;
using ApiCadastroClientes.Services;
using ApiNotasSimples.Helpers;
using ApiNotasSimples.Models;
using ApiNotasSimples.Models.DTO;
using ApiNotasSimples.Services;
using Microsoft.AspNetCore.Mvc;

namespace ApiCadastroClientes.Controllers
{
    [ApiController]
    [Route("api")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        //CADASTRAR e verificar se cpf é valido entre outros dados
        [HttpPost("Cadastro")]
        public async Task<IActionResult> Cadastro([FromBody] UsuarioDTO cadastro)
        {
            if (!CpfValidator.Validar(cadastro.Cpf))
            {
                return BadRequest(new { mensagem = "CPF inválido." });
            }

            if (cadastro == null || !ModelState.IsValid)
                return BadRequest("Dados inválidos.");

            try
            {
                var usuario = await _authService.Cadastrar(cadastro);
                return Ok(new Response<UsuarioResult> (new UsuarioResult(usuario), "sucesso", true));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao cadastrar: {ex.Message}");
            }
        }

        //LOGIN
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO login)
            {
            var usuario = await _authService.Logar(login);

            if (usuario == null)
                return Unauthorized("Email ou senha incorretos.");

            Console.Write(usuario.Role);
            var token = TokenService.GerarToken(usuario);

            return Ok(new
            {
                token,
                usuario.Id,
                usuario.Nome,
                usuario.Email,
                usuario.Role
            });
        }
    }
}