using System.ComponentModel.DataAnnotations;

namespace ApiNotasSimples.Models.DTO
{
    public class NotaDTO
    {
        [MinLength(3)] //define 
        public string Titulo { get; set; }
        [MinLength(3)]
        public string Conteudo { get; set; }

    }
}
