export class ReportGenerator {
  constructor(database) {
    this.db = database;
  }

  generateReport(reportType, user, items) {
    const visibleItems = this.getVisibleItems(user, items);
    const total = this.sumValues(visibleItems);

    const header = this.buildHeader(reportType, user);
    const body = this.buildBody(reportType, user, visibleItems);
    const footer = this.buildFooter(reportType, total);

    return `${header}${body}${footer}`.trim();
  }

  getVisibleItems(user, items) {
    if (user.role === 'ADMIN') {
      return items;
    }

    return items.filter((item) => item.value <= 500);
  }

  sumValues(items) {
    return items.reduce((acc, item) => acc + item.value, 0);
  }

  buildHeader(reportType, user) {
    if (reportType === 'CSV') {
      return 'ID,NOME,VALOR,USUARIO\n';
    }

    if (reportType === 'HTML') {
      return (
        '<html><body>\n' +
        '<h1>Relatório</h1>\n' +
        `<h2>Usuário: ${user.name}</h2>\n` +
        '<table>\n' +
        '<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n'
      );
    }

    return '';
  }

  buildBody(reportType, user, items) {
    if (reportType === 'CSV') {
      return items.map((item) => this.formatCsvRow(item, user)).join('');
    }

    if (reportType === 'HTML') {
      return items.map((item) => this.formatHtmlRow(item, user)).join('');
    }

    return '';
  }

  formatCsvRow(item, user) {
    return `${item.id},${item.name},${item.value},${user.name}\n`;
  }

  formatHtmlRow(item, user) {
    const isPriority = user.role === 'ADMIN' && item.value > 1000;
    const style = isPriority ? ' style="font-weight:bold;"' : '';

    return `<tr${style}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
  }

  buildFooter(reportType, total) {
    if (reportType === 'CSV') {
      return `\nTotal,,\n${total},,\n`;
    }

    if (reportType === 'HTML') {
      return `</table>\n<h3>Total: ${total}</h3>\n</body></html>\n`;
    }

    return '';
  }
}
