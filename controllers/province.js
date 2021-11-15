'use strict';

const { Province } = require('../models');
const { SLError, errorCodes } = require('../utils/error');

/**
 * 
 * @returns {Object[]} Provinces
 */

exports.getProvinces = async () => {
  try {
    const provinces = await Province.findAll({ raw: true });
    return {
      provinces,
    }
  }
  catch (err) {
    console.error(err);
    throw new SLError(errorCodes.read_province_error, err);
  }
}

/**
 * 
 * @param {Object[]} provinces 
 * @returns {Object[]} Created provinces
 */

exports.createProvinces = async (provinces) => {
  try {
    const createdProvinces = await Promise.all(provinces.map(province => new Promise(async resolve => {
      const _province = await Province.findOne({ where: { name: province.name }, raw: true });
      if (_province)
        return resolve(null);
  
      const createdProvince = await Province.create(province, { raw: true });
      return resolve(createdProvince);
    })));

    return {
      provinces: createdProvinces.filter(p => p !== null),
    }
  }
  catch (err) {
    console.error(err);
    throw new SLError(errorCodes.create_province_error, err);
  }
}

/**
 * 
 * @param {Object[]} provinces 
 * @returns {Object[]} Updated provinces
 */

exports.updateProvinces = async (provinces) => {
  try {
    const updatedProvinces = await Promise.all(provinces.map(province => new Promise(async resolve => {
      const _province = await Province.findOne({ where: { name: province.name }, raw: true });
      if (!_province)
        return resolve(null);

      const updatedProvince = await Province.update({
        count: province.count,
      }, { 
        where: {
          name: province.name,
        },
        returning: true, 
      });

      return resolve(updatedProvince[1][0]);
    })));

    return {
      provinces: updatedProvinces.filter(p => p !== null),
    }
  }
  catch (err) {
    console.error(err);
    throw new SLError(errorCodes.update_province_error, err);
  }
}

exports.initializeProvinces = async () => {
  const provinceData = {"VNM429": "Quảng Ninh", "VNM444": "Tây Ninh", "VNM450": "Điện Biên", "VNM451": "Bắc Kạn", "VNM452": "Thái Nguyên", "VNM453": "Lai Châu", "VNM454": "Lạng Sơn", "VNM455": "Sơn La", "VNM456": "Thanh Hóa", "VNM457": "Tuyên Quang", "VNM458": "Yên Bái", "VNM459": "Hòa Bình", "VNM460": "Hải Dương", "VNM4600": "Hải Phòng", "VNM461": "Hưng Yên", "VNM462": "Hà Nội", "VNM463": "Bắc Ninh", "VNM464": "Vĩnh Phúc", "VNM466": "Ninh Bình", "VNM467": "Hà Nam", "VNM468": "Nam Định", "VNM469": "Phú Thọ", "VNM470": "Bắc Giang", "VNM471": "Thái Bình", "VNM474": "Hà Tĩnh", "VNM475": "Nghệ An", "VNM476": "Quảng Bình", "VNM477": "Đắk Lắk", "VNM478": "Gia Lai", "VNM479": "Khánh Hòa", "VNM480": "Lâm Đồng", "VNM481": "Ninh Thuận", "VNM482": "Phú Yên", "VNM483": "Bình Dương", "VNM4834": "Tiền Giang", "VNM4835": "Đắk Nông", "VNM484": "Bình Phước", "VNM485": "Bình Định", "VNM486": "Kon Tum", "VNM487": "Quàng Nam", "VNM488": "Quảng Ngãi", "VNM489": "Quảng Trị", "VNM490": "Thừa Thiên - Huế", "VNM491": "Đà Nẵng", "VNM495": "Bà Rịa - Vũng Tàu", "VNM496": "Bình Thuận", "VNM497": "Đồng Nai", "VNM498": "An Giang", "VNM499": "Cần Thơ", "VNM500": "Ðồng Tháp", "VNM501": "Thành phố Hồ Chí Minh", "VNM502": "Kiên Giang", "VNM503": "Long An", "VNM504": "Bến Tre", "VNM505": "Hậu Giang", "VNM506": "Bạc Liêu", "VNM507": "Cà Mau", "VNM508": "Sóc Trăng", "VNM509": "Trà Vinh", "VNM510": "Vĩnh Long", "VNM511": "Cao Bằng", "VNM512": "Hà Giang", "VNM5483": "Lào Cai"}
  
  await this.createProvinces(Object.keys(provinceData).map(pk => ({
    name: provinceData[pk],
    code: pk,
  })));
}
