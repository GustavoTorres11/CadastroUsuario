import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface DashboardCard {
  title: string;
  newCount: number;
  newLabel: string;
  closedCount: number;
  closedLabel: string;
  infoTitle: string;
  infoItems: string[];
}

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  dashboardCards: DashboardCard[] = [
    {
      title: 'Resumo de Tarefas',
      newCount: 214,
      newLabel: 'Novas Tarefas',
      closedCount: 75,
      closedLabel: 'Finalizadas',
      infoTitle: 'Informações rápidas:',
      infoItems: ['Tempo de uso: 8,5 horas', '50 novos clientes']
    },
    {
      title: 'Atividades Recentes',
      newCount: 33,
      newLabel: 'Novas Propostas',
      closedCount: 20,
      closedLabel: 'Requisições',
      infoTitle: 'Resumo:',
      infoItems: ['Equipe ativa hoje', '120 tickets processados']
    },
    {
      title: 'Chamados Técnicos',
      newCount: 18,
      newLabel: 'Em aberto',
      closedCount: 41,
      closedLabel: 'Resolvidos',
      infoTitle: 'Relatório:',
      infoItems: ['Tempo médio: 1h 35min', 'Feedbacks positivos: 87%']
    }
  ];

  constructor() { }
}

