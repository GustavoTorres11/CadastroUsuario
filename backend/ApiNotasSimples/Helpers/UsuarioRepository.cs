using ApiNotasSimples.Data.Context;
using ApiNotasSimples.Models;
using ApiNotasSimples.Models.DTO;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;

namespace ApiCadastroClientes.Data.Repositories
{
    public class UsuarioRepository
    {
        private readonly SqlServerContext _context;
        private readonly ILogger<UsuarioRepository> _logger;

        public UsuarioRepository(SqlServerContext context, ILogger<UsuarioRepository> logger)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        //adicionar
        public async Task<UsuarioModel> Adicionar(UsuarioModel usuario)
        {
            await using var conn = _context.GetConnection();
            await conn.OpenAsync();

            var cmd = new SqlCommand(@"INSERT INTO Usuarios (Name, Email, Password, Endereco, Cpf, Telefone, Role, Record_status)
                                       VALUES (@name, @email, @password, @endereco, @cpf, @telefone, @role, @record_status);", conn);
            cmd.Parameters.AddWithValue("@name", (object)usuario.Name ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@email", (object)usuario.Email ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@password", (object)usuario.Password ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@endereco", (object)usuario.Endereco ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@cpf", (object)usuario.Cpf ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@telefone", (object)usuario.Telefone ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@role", (object)usuario.Role ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@record_status", (object)usuario.Record_status ?? DBNull.Value);

            await cmd.ExecuteNonQueryAsync();
            var novoUsuario = await BuscarPorEmail(usuario.Email);
            if (novoUsuario == null)
                throw new Exception("Falha ao recuperar usuário após inserção");

            _logger.LogInformation("Usuário adicionado com ID: {Id}", novoUsuario.Id);
            return novoUsuario;
        }

        //buscar por email
        public async Task<UsuarioModel?> BuscarPorEmail(string email)
        {
            if (string.IsNullOrEmpty(email)) throw new ArgumentException("E-mail inválido", nameof(email));
            await using var conn = _context.GetConnection();
            try
            {
                await conn.OpenAsync();
                var cmd = new SqlCommand("SELECT Id, Name, Email, Password, Telefone, Cpf, Endereco, Role FROM Usuarios WHERE Email = @Email and Record_status = 1", conn);
                cmd.Parameters.AddWithValue("@Email", email);

                await using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    var usuario = new UsuarioModel
                    {
                        Id = reader.GetGuid(0),
                        Name = reader.GetString(1),
                        Email = reader.GetString(2),
                        Password = reader.IsDBNull(3) ? null : reader.GetString(3),
                        Telefone = reader.GetString(4),
                        Cpf = reader.GetString(5),
                        Endereco = reader.GetString(6),
                        Role = reader.GetString(7)
                    };
                    _logger.LogDebug("Usuário retornado: {Email}, Senha: {Password}", email, usuario.Password);
                    return usuario;
                }
                _logger.LogWarning("Nenhum usuário encontrado para e-mail: {Email}", email);
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar usuário por e-mail: {Email}", email);
                throw;
            }
        }

        //buscar por ID
        public async Task<UsuarioModel?> BuscarPorId(Guid id)
        {
            await using var conn = _context.GetConnection();
            await conn.OpenAsync();

            var cmd = new SqlCommand("SELECT * FROM Usuarios WHERE Id = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);

            await using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new UsuarioModel
                {
                    Id = reader.GetGuid(0),
                    Name = reader.GetString(1),
                    Email = reader.GetString(2),
                    Telefone = reader.GetString(4),
                    Cpf = reader.GetString(5),
                    Endereco = reader.GetString(6),
                    Role = reader.GetString(7)
                };
            }

            return null;
        }

        public async Task<List<UsuarioModel>> BuscarPorTermo(string termo = "")
        {
            var usuarios = new List<UsuarioModel>();

            using var connection = _context.GetConnection();
            await connection.OpenAsync();

            string query;

            if (!string.IsNullOrWhiteSpace(termo))
            {
                query = @"
                SELECT Id, Name, Email, Password, Endereco, Cpf, Telefone, Role, Record_status
                FROM Usuarios
                WHERE Record_status = 1
                AND (
                Name LIKE @Termo OR
                Email LIKE @Termo OR
                CONVERT(VARCHAR, Cpf) LIKE @Termo
                )";

            }
            else
            {
                query = "SELECT Id, Name, Email, Password, Endereco, Cpf, Telefone, Role FROM Usuarios Where Record_status = 1";
            }

            var command = new SqlCommand(query, connection);

            if (!string.IsNullOrWhiteSpace(termo))
            {
                command.Parameters.AddWithValue("@Termo", $"%{termo}%");
            }

            var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                usuarios.Add(new UsuarioModel
                {
                    Id = reader.GetGuid(0),
                    Name = reader.IsDBNull(1) ? string.Empty : reader.GetString(1),
                    Email = reader.IsDBNull(2) ? string.Empty : reader.GetString(2),
                    Password = reader.IsDBNull(3) ? null : reader.GetString(3),
                    Endereco = reader.IsDBNull(4) ? null : reader.GetString(4),
                    Cpf = reader.IsDBNull(5) ? null : reader.GetString(5),
                    Telefone = reader.IsDBNull(6) ? null : reader.GetString(6),
                    Role = reader.IsDBNull(7) ? null : reader.GetString(7)
                });
            }

            return usuarios;
        }



        //listar todos
        public async Task<List<UsuarioResult>> ListarTodos()
        {
            await using var conn = _context.GetConnection();
            await conn.OpenAsync();

            var cmd = new SqlCommand("SELECT * FROM Usuarios Where Record_status = 1", conn);
            await using var reader = await cmd.ExecuteReaderAsync();

            var lista = new List<UsuarioModel>();
            while (await reader.ReadAsync())
            {
                lista.Add(new UsuarioModel
                {
                    Id = reader.GetGuid(0),
                    Name = reader.GetString(1),
                    Email = reader.GetString(2),
                    Telefone = reader.IsDBNull(4) ? null : reader.GetString(4),
                    Cpf = reader.IsDBNull(5) ? null : reader.GetString(5),
                    Endereco = reader.IsDBNull(6) ? null : reader.GetString(6),
                    Role = reader.IsDBNull(7) ? null : reader.GetString(7)
                });
            }

            var result = new List<UsuarioResult>();
            foreach (var usuario in lista)
            {
                var usuarioResult = new UsuarioResult(usuario);

                result.Add(usuarioResult);

            }

            return result;
        }

        //Atualizar
        public async Task<bool> Atualizar(Guid id, UsuarioModel usuario)
        {
            await using var conn = _context.GetConnection();
            await conn.OpenAsync();

            var cmd = new SqlCommand(@"UPDATE Usuarios 
                                       SET Name = @name, Email = @email, Password = @password, Endereco = @endereco, Cpf = @cpf, Telefone = @telefone 
                                       WHERE Id = @id, Record_status = 1", conn);
            cmd.Parameters.AddWithValue("@id", id);
            cmd.Parameters.AddWithValue("@name", (object)usuario.Name ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@email", (object)usuario.Email ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@password", (object)usuario.Password ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@endereco", (object)usuario.Endereco ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@cpf", (object)usuario.Cpf ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@telefone", (object)usuario.Telefone ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@role", (object)usuario.Role ?? DBNull.Value);

            var rows = await cmd.ExecuteNonQueryAsync();
            return rows > 0;
        }

        //remover
        public async Task<bool> Remover(Guid id)
        {
            await using var conn = _context.GetConnection();
            await conn.OpenAsync();

            var cmd = new SqlCommand("UPDATE Usuarios SET Record_status = 0 WHERE Id = @Id", conn);

            cmd.Parameters.AddWithValue("@Id", id);

            var rows = await cmd.ExecuteNonQueryAsync();
            return rows > 0;
        }
    }
}