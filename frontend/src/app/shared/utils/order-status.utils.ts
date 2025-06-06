import {OrderStatusType} from "../../../types/orderStatus.type";

export class OrderStatusUtils {
  static getStatusAndColor(status: OrderStatusType | undefined | null): { name: string, color: string } {

    let name = 'Новый';
    let color = '#456F49';

    switch (status) {
      case OrderStatusType.delivery:
        name = 'Доставка';
        break;
      case OrderStatusType.cancelled:
        name = 'Отменен';
        color = '#FF7575';
        break;
      case OrderStatusType.pending:
        name = 'Обработка';
        break;
      case OrderStatusType.success:
        name = 'Выполнен';
        color = '#B6D589';
        break;
    }

    return {name, color};
  }
}
