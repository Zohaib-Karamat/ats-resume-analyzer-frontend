import api from "../../../lib/axios";

function unwrapData(response) {
  return response.data?.data ?? response.data;
}

function normalizeJD(jd) {
  if (!jd) return jd;

  return {
    ...jd,
    id: jd.id ?? jd._id,
    title: jd.title ?? "",
    company: jd.company ?? "",
    content: jd.content ?? jd.description ?? "",
    description: jd.description ?? jd.content ?? "",
    date: jd.date ?? jd.createdAt ?? jd.updatedAt ?? null,
  };
}

function normalizeList(payload, fallbackParams = {}) {
  const items = Array.isArray(payload)
    ? payload
    : payload?.jobDescriptions ??
      payload?.jobdescriptions ??
      payload?.descriptions ??
      payload?.items ??
      payload?.data ??
      [];

  const metaSource = payload?.meta ?? payload?.pagination ?? payload ?? {};
  const page = Number(metaSource.page ?? fallbackParams.page ?? 1);
  const limit = Number(metaSource.limit ?? fallbackParams.limit ?? 5);
  const total = Number(metaSource.total ?? metaSource.count ?? items.length);
  const totalPages = Number(
    metaSource.totalPages ?? Math.max(1, Math.ceil(total / limit)),
  );

  return {
    data: items.map(normalizeJD),
    meta: { total, page, limit, totalPages },
  };
}

function normalizePayload(payload) {
  return normalizeJD(payload?.jobDescription ?? payload?.jobdescription ?? payload);
}

function toApiPayload(data) {
  const payload = {};

  if (data.title !== undefined) payload.title = data.title;
  if (data.company !== undefined) payload.company = data.company;
  if (data.description !== undefined) payload.description = data.description;
  if (data.content !== undefined) payload.description = data.content;

  return payload;
}

export const jobDescriptionApi = {
  list: async ({ search = "", page = 1, limit = 5, sort = "desc" } = {}) => {
    const trimmedSearch = search.trim();
    const response = await api.get("/job-descriptions", {
      params: {
        page,
        limit,
        sort,
        ...(trimmedSearch ? { search: trimmedSearch } : {}),
      },
    });
    return normalizeList(unwrapData(response), { page, limit });
  },

  getById: async (id) => {
    const response = await api.get(`/job-descriptions/${id}`);
    return normalizePayload(unwrapData(response));
  },

  create: async (data) => {
    const response = await api.post("/job-descriptions", toApiPayload(data));
    return normalizePayload(unwrapData(response));
  },

  update: async ({ id, data }) => {
    const response = await api.patch(`/job-descriptions/${id}`, toApiPayload(data));
    return normalizePayload(unwrapData(response));
  },

  delete: async (id) => {
    const response = await api.delete(`/job-descriptions/${id}`);
    return unwrapData(response);
  },
};
