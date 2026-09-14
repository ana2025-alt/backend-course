import { RequestsStore } from './requests.store.js';
import { withTransaction } from '../../database/transaction.js';
import { mapRequestRow, mapHistoryRow } from './request.mapper.js';

export class RequestsService {
  static async listRequests(filters) {
    const rows = await RequestsStore.findAll(filters);
    return rows.map(mapRequestRow);
  }

  static async getRequestById(id) {
    const row = await RequestsStore.findById(id);
    if (!row) {
      const error = new Error(`Request with id ${id} not found`);
      error.status = 404;
      throw error;
    }
    const historyRows = await RequestsStore.findStatusHistoryByRequestId(id);
    return {
      ...mapRequestRow(row),
      history: historyRows.map(mapHistoryRow)
    };
  }

  static async createRequest(data) {
    return await withTransaction(async (client) => {
      const newRow = await RequestsStore.create(data, client);
      await RequestsStore.createStatusHistory({
        requestId: newRow.id,
        previousStatus: null,
        newStatus: newRow.status
      }, client);
      return mapRequestRow(newRow);
    });
  }

  static async updateStatus(id, newStatus) {
    return await withTransaction(async (client) => {
      const current = await RequestsStore.findById(id, client);
      if (!current) {
        const error = new Error(`Request with id ${id} not found`);
        error.status = 404;
        throw error;
      }

      if (current.status === newStatus) {
        return mapRequestRow(current);
      }

      const updated = await RequestsStore.update(id, { status: newStatus }, client);
      await RequestsStore.createStatusHistory({
        requestId: id,
        previousStatus: current.status,
        newStatus
      }, client);

      return mapRequestRow(updated);
    });
  }

  static async cancelRequest(id) {
    return await this.updateStatus(id, 'cancelled');
  }
} 