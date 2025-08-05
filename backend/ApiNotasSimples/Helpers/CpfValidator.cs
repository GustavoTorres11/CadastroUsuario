namespace ApiNotasSimples.Helpers
{
    public static class CpfValidator
    {
        public static bool Validar(string cpf)
        {
            // Remove tudo que não for número (pontos, hífens, espaços)
            cpf = new string(cpf.Where(char.IsDigit).ToArray());

            // Verifica se o CPF tem exatamente 11 dígitos, ou se os num são iguais
            if (cpf.Length != 11 || cpf.Distinct().Count() == 1)
                return false;

            // Laço que calcula os dois dígitos verificadores (posição 9 e 10)
            for (int j = 9; j < 11; j++)
            {
                int soma = 0;

                // Multiplica os dígitos pela sequência decrescente e soma
                // Exemplo: para o 1º dígito, multiplica os 9 primeiros por 10 até 2
                for (int i = 0; i < j; i++)
                    soma += (cpf[i] - '0') * (j + 1 - i);

                // Calcula o dígito esperado
                int digito = soma % 11;
                digito = (digito < 2) ? 0 : 11 - digito;

                // Verifica se o dígito do CPF é igual ao calculado
                if ((cpf[j] - '0') != digito)
                    return false;
            }
            return true;
        }
    }
}