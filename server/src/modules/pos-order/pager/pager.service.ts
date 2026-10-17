import { PagerRepo } from './pager.repo';
import {
  CreatePagerType,
  FilterPagerQueryType,
  UpdateBatteryType,
  UpdatePagerStatusType,
  UpdatePagerType,
} from './pager.schema';

export class PagerService {
  private pagerRepo = new PagerRepo();

  /**
   * Lấy danh sách thẻ rung có phân trang & lọc
   */
  async getPagers(filter: FilterPagerQueryType) {
    return await this.pagerRepo.getPagers(filter);
  }

  /**
   * Lấy thông tin chi tiết thẻ rung theo ID
   */
  async getPagerById(id: number) {
    const pager = await this.pagerRepo.getPagerById(id);
    if (!pager) {
      throw new Error(`Thẻ rung #${id} không tồn tại hoặc đã bị xóa`);
    }
    return pager;
  }

  /**
   * Lấy danh sách thẻ rung đang sẵn sàng phục vụ khách
   */
  async getAvailablePagers() {
    return await this.pagerRepo.getAvailablePagers();
  }

  /**
   * Bảng điều phối theo dõi thời gian chờ của các thẻ đang phát cho khách
   */
  async getActiveDashboard() {
    return await this.pagerRepo.getActivePagerDashboard();
  }

  /**
   * Tạo mới thiết bị thẻ rung (Ngăn chặn tạo trùng với thẻ đang hoạt động)
   */
  async createPager(data: CreatePagerType) {
    let pagerCode = data.pagerCode?.trim();

    if (!pagerCode) {
      pagerCode = await this.pagerRepo.getNextPagerCode();
    } else {
      const existing = await this.pagerRepo.getPagerByCode(pagerCode);
      if (existing && !existing.deletedAt) {
        throw new Error(`Mã thẻ rung '${pagerCode}' đang hoạt động trên hệ thống`);
      }
    }

    const created = await this.pagerRepo.createPager({
      ...data,
      pagerCode,
    });
    return {
      message: `Thêm thiết bị thẻ rung '${pagerCode}' thành công`,
      data: created,
    };
  }

  /**
   * Cập nhật thông tin thẻ rung (Chặn nếu thẻ đang IN_USE)
   */
  async updatePager(id: number, data: UpdatePagerType) {
    const pager = await this.getPagerById(id);

    if (pager.status === 'IN_USE') {
      throw new Error(
        'Thẻ rung đang phục vụ khách hàng (IN_USE), không thể chỉnh sửa thông tin hoặc trạng thái!'
      );
    }

    if (data.pagerCode) {
      const existing = await this.pagerRepo.getPagerByCode(data.pagerCode);
      if (existing && existing.id !== id && !existing.deletedAt) {
        throw new Error(`Mã thẻ rung '${data.pagerCode}' đã được sử dụng cho thiết bị khác`);
      }
    }

    const updated = await this.pagerRepo.updatePager(id, data);
    return {
      message: 'Cập nhật thông tin thẻ rung thành công',
      data: updated,
    };
  }

  /**
   * Cập nhật trạng thái thẻ rung (Chặn nếu thẻ đang IN_USE)
   */
  async updateStatus(id: number, body: UpdatePagerStatusType) {
    const pager = await this.getPagerById(id);

    if (pager.status === 'IN_USE') {
      throw new Error(
        'Thẻ rung đang được phát cho khách (IN_USE), không được phép đổi trạng thái trực tiếp! Vui lòng thực hiện Thu hồi thẻ trước.'
      );
    }

    const updated = await this.pagerRepo.updateStatus(id, body.status);
    return {
      message: `Cập nhật trạng thái thẻ rung thành '${body.status}' thành công`,
      data: updated,
    };
  }

  /**
   * Cập nhật mức pin của thẻ rung (Chặn nếu thẻ đang IN_USE)
   */
  async updateBattery(id: number, body: UpdateBatteryType) {
    const pager = await this.getPagerById(id);

    if (pager.status === 'IN_USE') {
      throw new Error('Không thể cập nhật pin khi thiết bị đang phục vụ khách!');
    }

    const updated = await this.pagerRepo.updateBattery(id, body.batteryLevel);
    return {
      message: `Cập nhật mức pin (${body.batteryLevel}%) thành công`,
      data: updated,
    };
  }

  /**
   * Thu hồi / giải phóng thẻ rung về trạng thái AVAILABLE khi khách trả thẻ
   */
  async releasePager(id: number) {
    await this.getPagerById(id);

    // 1. Gọi Repo gỡ pagerId khỏi các đơn hàng chưa hoàn tất để thẻ biến mất khỏi bảng điều phối
    await this.pagerRepo.detachPagerFromPendingOrders(id);

    // 2. Chuyển trạng thái thẻ rung về AVAILABLE
    const updated = await this.pagerRepo.updateStatus(id, 'AVAILABLE');

    return {
      message: 'Đã thu hồi và chuyển trạng thái thẻ rung về AVAILABLE',
      data: updated,
    };
  }

  /**
   * Xóa mềm thiết bị thẻ rung
   */
  async deletePager(id: number) {
    const pager = await this.getPagerById(id);

    if (pager.status === 'IN_USE') {
      throw new Error('Không thể xóa thẻ rung đang được gán cho đơn hàng chưa hoàn tất!');
    }

    const success = await this.pagerRepo.softDeletePager(id);
    if (!success) {
      throw new Error('Xóa thiết bị thẻ rung thất bại');
    }

    return {
      message: `Đã xóa thiết bị thẻ rung #${id} thành công`,
    };
  }
}