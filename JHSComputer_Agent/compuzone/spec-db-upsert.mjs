const CATEGORY_ALIASES = {
  CPU_COOLER: 'COOLER',
};

export function json(value) {
  return value == null ? null : JSON.stringify(value);
}

function jsonArray(value) {
  return Array.isArray(value) && value.length > 0 ? json(value) : null;
}

function flag(value) {
  return value == null ? null : value ? 'Y' : 'N';
}

function categoryOf(category) {
  return CATEGORY_ALIASES[category] ?? category;
}

function valueOrCurrent(value, current) {
  return value ?? current ?? null;
}

/**
 * Parsed attributes are deliberately merged with existing rows. A missing
 * value in a supplier summary must not erase a value parsed from an older,
 * richer source record.
 */
export async function upsertSpec(connection, partId, category, attrs, current = {}) {
  const normalizedCategory = categoryOf(category);

  if (normalizedCategory === 'CPU') {
    const socket = valueOrCurrent(attrs.socket, current.socket);
    if (!socket) return false;
    await connection.execute(
      `INSERT INTO cpu_specs
        (PART_ID, SOCKET, FAMILY, GENERATION, CODENAME, CORE_COUNT, THREAD_COUNT,
         BASE_CLOCK_GHZ, BOOST_CLOCK_GHZ, L2_CACHE_MB, L3_CACHE_MB, TDP_W, PBP_W, MTP_W,
         MEMORY_TYPES_JSON, PCIE_VERSIONS_JSON, HAS_INTEGRATED_GRAPHICS, INTEGRATED_GRAPHICS_NAME)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         SOCKET=VALUES(SOCKET),
         FAMILY=COALESCE(VALUES(FAMILY), FAMILY),
         GENERATION=COALESCE(VALUES(GENERATION), GENERATION),
         CODENAME=COALESCE(VALUES(CODENAME), CODENAME),
         CORE_COUNT=COALESCE(VALUES(CORE_COUNT), CORE_COUNT),
         THREAD_COUNT=COALESCE(VALUES(THREAD_COUNT), THREAD_COUNT),
         BASE_CLOCK_GHZ=COALESCE(VALUES(BASE_CLOCK_GHZ), BASE_CLOCK_GHZ),
         BOOST_CLOCK_GHZ=COALESCE(VALUES(BOOST_CLOCK_GHZ), BOOST_CLOCK_GHZ),
         L2_CACHE_MB=COALESCE(VALUES(L2_CACHE_MB), L2_CACHE_MB),
         L3_CACHE_MB=COALESCE(VALUES(L3_CACHE_MB), L3_CACHE_MB),
         TDP_W=COALESCE(VALUES(TDP_W), TDP_W),
         PBP_W=COALESCE(VALUES(PBP_W), PBP_W),
         MTP_W=COALESCE(VALUES(MTP_W), MTP_W),
         MEMORY_TYPES_JSON=COALESCE(VALUES(MEMORY_TYPES_JSON), MEMORY_TYPES_JSON),
         PCIE_VERSIONS_JSON=COALESCE(VALUES(PCIE_VERSIONS_JSON), PCIE_VERSIONS_JSON),
         HAS_INTEGRATED_GRAPHICS=COALESCE(VALUES(HAS_INTEGRATED_GRAPHICS), HAS_INTEGRATED_GRAPHICS),
         INTEGRATED_GRAPHICS_NAME=COALESCE(VALUES(INTEGRATED_GRAPHICS_NAME), INTEGRATED_GRAPHICS_NAME)`,
      [
        partId,
        socket,
        attrs.family,
        attrs.generation,
        attrs.codename,
        attrs.coreCount,
        attrs.threadCount,
        attrs.baseClockGhz,
        attrs.boostClockGhz,
        attrs.l2CacheMb,
        attrs.l3CacheMb,
        attrs.tdpW,
        attrs.pbpW,
        attrs.mtpW,
        jsonArray(attrs.memoryTypes),
        jsonArray(attrs.pcieVersions),
        flag(attrs.hasIntegratedGraphics),
        attrs.integratedGraphicsName,
      ],
    );
    return true;
  }

  if (normalizedCategory === 'MAINBOARD') {
    const socket = valueOrCurrent(attrs.socket, current.socket);
    if (!socket) return false;
    await connection.execute(
      `INSERT INTO mainboard_specs
        (PART_ID, SOCKET, CHIPSET, FORM_FACTOR, MEMORY_TYPE, MEMORY_SLOT_COUNT,
         MAX_MEMORY_GB, M2_SLOT_COUNT, SATA_PORT_COUNT, PCIE_X16_SLOT_COUNT, WIFI_BUILTIN)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         SOCKET=VALUES(SOCKET),
         CHIPSET=COALESCE(VALUES(CHIPSET), CHIPSET),
         FORM_FACTOR=COALESCE(VALUES(FORM_FACTOR), FORM_FACTOR),
         MEMORY_TYPE=COALESCE(VALUES(MEMORY_TYPE), MEMORY_TYPE),
         MEMORY_SLOT_COUNT=COALESCE(VALUES(MEMORY_SLOT_COUNT), MEMORY_SLOT_COUNT),
         MAX_MEMORY_GB=COALESCE(VALUES(MAX_MEMORY_GB), MAX_MEMORY_GB),
         M2_SLOT_COUNT=COALESCE(VALUES(M2_SLOT_COUNT), M2_SLOT_COUNT),
         SATA_PORT_COUNT=COALESCE(VALUES(SATA_PORT_COUNT), SATA_PORT_COUNT),
         PCIE_X16_SLOT_COUNT=COALESCE(VALUES(PCIE_X16_SLOT_COUNT), PCIE_X16_SLOT_COUNT),
         WIFI_BUILTIN=COALESCE(VALUES(WIFI_BUILTIN), WIFI_BUILTIN)`,
      [
        partId,
        socket,
        attrs.chipset,
        attrs.forms?.[0] ?? null,
        attrs.memoryType,
        attrs.memorySlotCount,
        attrs.maxMemoryGb,
        attrs.m2SlotCount,
        attrs.sataPortCount,
        attrs.pcieX16SlotCount,
        flag(attrs.wifiBuiltin),
      ],
    );
    return true;
  }

  if (normalizedCategory === 'RAM') {
    const memoryType = valueOrCurrent(attrs.memoryType, current.memoryType);
    const capacityGb = valueOrCurrent(attrs.capacityGb, current.capacityGb);
    if (!memoryType || !capacityGb) return false;
    await connection.execute(
      `INSERT INTO ram_specs
        (PART_ID, MEMORY_TYPE, CAPACITY_GB, MODULE_COUNT, SPEED_MHZ, PROFILE_TYPE)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         MEMORY_TYPE=VALUES(MEMORY_TYPE),
         CAPACITY_GB=VALUES(CAPACITY_GB),
         MODULE_COUNT=COALESCE(VALUES(MODULE_COUNT), MODULE_COUNT),
         SPEED_MHZ=COALESCE(VALUES(SPEED_MHZ), SPEED_MHZ),
         PROFILE_TYPE=COALESCE(VALUES(PROFILE_TYPE), PROFILE_TYPE)`,
      [partId, memoryType, capacityGb, attrs.moduleCount, attrs.speedMhz, attrs.profileType],
    );
    return true;
  }

  if (normalizedCategory === 'SSD') {
    const capacityGb = valueOrCurrent(attrs.capacityGb, current.capacityGb);
    if (!capacityGb) return false;
    await connection.execute(
      `INSERT INTO storage_specs
        (PART_ID, STORAGE_TYPE, FORM_FACTOR, INTERFACE_TEXT, CAPACITY_GB, SEQ_READ_MBPS, SEQ_WRITE_MBPS)
       VALUES (?, 'SSD', ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         FORM_FACTOR=COALESCE(VALUES(FORM_FACTOR), FORM_FACTOR),
         INTERFACE_TEXT=COALESCE(VALUES(INTERFACE_TEXT), INTERFACE_TEXT),
         CAPACITY_GB=VALUES(CAPACITY_GB),
         SEQ_READ_MBPS=COALESCE(VALUES(SEQ_READ_MBPS), SEQ_READ_MBPS),
         SEQ_WRITE_MBPS=COALESCE(VALUES(SEQ_WRITE_MBPS), SEQ_WRITE_MBPS)`,
      [
        partId,
        attrs.forms?.[0] ?? current.formFactor ?? 'M.2',
        attrs.interfaceText,
        capacityGb,
        attrs.seqReadMbps,
        attrs.seqWriteMbps,
      ],
    );
    return true;
  }

  if (normalizedCategory === 'PSU') {
    const wattage = valueOrCurrent(attrs.wattage, current.ratedWattage);
    if (!wattage) return false;
    await connection.execute(
      `INSERT INTO psu_specs
        (PART_ID, FORM_FACTOR, RATED_WATTAGE, CERTIFICATION, MODULAR_TYPE, PCIE_5_READY, CONNECTOR_JSON)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         FORM_FACTOR=COALESCE(VALUES(FORM_FACTOR), FORM_FACTOR),
         RATED_WATTAGE=VALUES(RATED_WATTAGE),
         CERTIFICATION=COALESCE(VALUES(CERTIFICATION), CERTIFICATION),
         MODULAR_TYPE=COALESCE(VALUES(MODULAR_TYPE), MODULAR_TYPE),
         PCIE_5_READY=COALESCE(VALUES(PCIE_5_READY), PCIE_5_READY),
         CONNECTOR_JSON=COALESCE(VALUES(CONNECTOR_JSON), CONNECTOR_JSON)`,
      [
        partId,
        current.formFactor ?? 'ATX',
        wattage,
        attrs.certification,
        attrs.modularType,
        flag(attrs.pcie5Ready),
        jsonArray(attrs.connectors),
      ],
    );
    return true;
  }

  if (normalizedCategory === 'CASE') {
    await connection.execute(
      `INSERT INTO case_specs
        (PART_ID, CASE_TYPE, COLOR, SUPPORTED_BOARD_FORMS_JSON, MAX_GPU_LENGTH_MM, MAX_COOLER_HEIGHT_MM, FAN_COUNT)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         CASE_TYPE=COALESCE(VALUES(CASE_TYPE), CASE_TYPE),
         COLOR=COALESCE(VALUES(COLOR), COLOR),
         SUPPORTED_BOARD_FORMS_JSON=COALESCE(VALUES(SUPPORTED_BOARD_FORMS_JSON), SUPPORTED_BOARD_FORMS_JSON),
         MAX_GPU_LENGTH_MM=COALESCE(VALUES(MAX_GPU_LENGTH_MM), MAX_GPU_LENGTH_MM),
         MAX_COOLER_HEIGHT_MM=COALESCE(VALUES(MAX_COOLER_HEIGHT_MM), MAX_COOLER_HEIGHT_MM),
         FAN_COUNT=COALESCE(VALUES(FAN_COUNT), FAN_COUNT)`,
      [
        partId,
        attrs.forms?.includes('ATX') ? 'ATX' : null,
        attrs.color,
        jsonArray(attrs.forms),
        attrs.gpuLengthMm,
        attrs.coolerHeightMm,
        attrs.fanCount,
      ],
    );
    return true;
  }

  if (normalizedCategory === 'COOLER') {
    await connection.execute(
      `INSERT INTO cooler_specs
        (PART_ID, COOLER_TYPE, COLOR, SUPPORTED_SOCKETS_JSON, HEIGHT_MM, FAN_SIZE_MM)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         COOLER_TYPE=VALUES(COOLER_TYPE),
         COLOR=COALESCE(VALUES(COLOR), COLOR),
         SUPPORTED_SOCKETS_JSON=COALESCE(VALUES(SUPPORTED_SOCKETS_JSON), SUPPORTED_SOCKETS_JSON),
         HEIGHT_MM=COALESCE(VALUES(HEIGHT_MM), HEIGHT_MM),
         FAN_SIZE_MM=COALESCE(VALUES(FAN_SIZE_MM), FAN_SIZE_MM)`,
      [
        partId,
        current.coolerType ?? 'AIR',
        attrs.color,
        jsonArray(attrs.socket ? [attrs.socket] : []),
        attrs.coolerHeightMm,
        attrs.fanSizeMm,
      ],
    );
    return true;
  }

  if (normalizedCategory === 'GPU') {
    await connection.execute(
      `INSERT INTO gpu_specs
        (PART_ID, CHIPSET_MAKER, CHIPSET_NAME, SERIES_NAME, MEMORY_TYPE, MEMORY_GB,
         INTERFACE_TEXT, RECOMMENDED_PSU_W, POWER_CONSUMPTION_W, POWER_PORTS_JSON,
         LENGTH_MM, HEIGHT_MM, THICKNESS_MM, DISPLAY_OUTPUTS_JSON)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         CHIPSET_MAKER=COALESCE(VALUES(CHIPSET_MAKER), CHIPSET_MAKER),
         CHIPSET_NAME=COALESCE(VALUES(CHIPSET_NAME), CHIPSET_NAME),
         SERIES_NAME=COALESCE(VALUES(SERIES_NAME), SERIES_NAME),
         MEMORY_TYPE=COALESCE(VALUES(MEMORY_TYPE), MEMORY_TYPE),
         MEMORY_GB=COALESCE(VALUES(MEMORY_GB), MEMORY_GB),
         INTERFACE_TEXT=COALESCE(VALUES(INTERFACE_TEXT), INTERFACE_TEXT),
         RECOMMENDED_PSU_W=COALESCE(VALUES(RECOMMENDED_PSU_W), RECOMMENDED_PSU_W),
         POWER_CONSUMPTION_W=COALESCE(VALUES(POWER_CONSUMPTION_W), POWER_CONSUMPTION_W),
         POWER_PORTS_JSON=COALESCE(VALUES(POWER_PORTS_JSON), POWER_PORTS_JSON),
         LENGTH_MM=COALESCE(VALUES(LENGTH_MM), LENGTH_MM),
         HEIGHT_MM=COALESCE(VALUES(HEIGHT_MM), HEIGHT_MM),
         THICKNESS_MM=COALESCE(VALUES(THICKNESS_MM), THICKNESS_MM),
         DISPLAY_OUTPUTS_JSON=COALESCE(VALUES(DISPLAY_OUTPUTS_JSON), DISPLAY_OUTPUTS_JSON)`,
      [
        partId,
        attrs.gpuChipsetMaker,
        attrs.gpuChipsetName,
        attrs.seriesName,
        attrs.gpuMemoryType,
        attrs.capacityGb,
        attrs.gpuInterfaceText,
        attrs.recommendedPsuW,
        attrs.powerConsumptionW,
        jsonArray(attrs.powerPorts),
        attrs.lengthMm,
        attrs.gpuHeightMm,
        attrs.gpuThicknessMm,
        jsonArray(attrs.displayOutputs),
      ],
    );
    return true;
  }

  return false;
}

export function hasRequiredSpecKey(category, attrs, current = {}) {
  const normalizedCategory = categoryOf(category);
  if (normalizedCategory === 'CPU' || normalizedCategory === 'MAINBOARD') {
    return Boolean(attrs.socket ?? current.socket);
  }
  if (normalizedCategory === 'RAM') {
    return Boolean((attrs.memoryType ?? current.memoryType) && (attrs.capacityGb ?? current.capacityGb));
  }
  if (normalizedCategory === 'SSD') return Boolean(attrs.capacityGb ?? current.capacityGb);
  if (normalizedCategory === 'PSU') return Boolean(attrs.wattage ?? current.ratedWattage);
  return true;
}
