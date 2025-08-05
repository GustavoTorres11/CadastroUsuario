using ApiCadastroClientes.Data.Repositories;
using ApiCadastroClientes.Models.DTO;
using ApiCadastroClientes.Services;
using ApiNotasSimples.Models;
using ApiNotasSimples.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class UsuarioController : ControllerBase
{
    private readonly UsuarioRepository _repo;
    private readonly AuthService _authService;
    private readonly CryptoService _cryptoService;

    // Injeção de dependência
    public UsuarioController(UsuarioRepository repo, AuthService authService, CryptoService cryptoService)
    {
        _repo = repo;
        _authService = authService;
        _cryptoService = cryptoService;
    }

    // POST: Cadastra novo usuário
    [HttpPost]
    public async Task<IActionResult> Cadastrar([FromBody] UsuarioDTO usuario)
    {
        if (usuario == null || !ModelState.IsValid)
            return BadRequest("Dados inválidos.");

        try
        {
            var novoUsuario = await _authService.Cadastrar(usuario);
            return Ok(new { mensagem = "Usuário cadastrado com sucesso", id = novoUsuario.Id });
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }

    // GET: Lista todos os usuários
    [HttpGet]
    [Authorize]
    public async Task<ActionResult> ListarTodos()
    {
        return Ok(await _repo.ListarTodos());
    }   

    // GET: Busca usuário por ID
    [HttpGet("{id}")]
    [Authorize]

    public async Task<IActionResult> BuscarPorId(Guid id)
    {
        var usuario = await _repo.BuscarPorId(id);
        if (usuario == null)
            return NotFound();
        Console.Write(usuario);
        return Ok(usuario);
    }

    // GET: Busca por usuário
    [HttpGet("buscar")]
    public async Task<IActionResult> BuscarPorTermo([FromQuery] string termo)
    {
        var usuarios = await _repo.BuscarPorTermo(termo);
        return Ok(usuarios);
    }

    // PUT: Atualiza usuário por ID
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Atualizar(Guid id, [FromBody] UsuarioModel usuario)
    {
        usuario.Senha = _cryptoService.HashPassword(usuario.Senha);
        var atualizado = await _repo.Atualizar(id, usuario);
        return Ok(new { mensagem = "Atualizado com sucesso" });
    }

    // DELETE: Remove usuário por ID
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Remover(Guid id)
    {
        var removido = await _repo.Remover(id);
        return Ok(new { mensagem = "Removido com sucesso" });
    }


    [HttpGet("usuario")]
    [Authorize]

    public async Task<IActionResult> GetUsuario()
    {
        try
        {
            var email = User.FindFirst(ClaimTypes.Name)?.Value;
            var usuario = await _repo.BuscarPorEmail(email);
            Console.Write(usuario);
            return Ok(usuario);
        }
        catch
        {
            return BadRequest(new { mensagem = "erro de token" });
        }
    }
}