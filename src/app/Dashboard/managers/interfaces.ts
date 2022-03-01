/**
 * Enum representing the various states that a card/task can be in.
 *
 * @enum {number}
 */
enum CardState {
    Hidden,
    Loading,
    Dismissed,
    Introducing,
    Ready,
    Error
}

enum Period {
    Day,
    Week,
    Month
}

enum ProductsBy {
    BY_COUNT = 'topByCount',
    BY_REVENUE = 'topByRevenue'
}

/**
 * The data returned by the dashboard API representing a specific card/task.
 *
 * @export
 * @interface BaseCardData
 */
interface BaseCardData {
    id: string
    type: string
    dismiss_url?: string
    [key: string]: any
}

/**
 * Metadata for a particular card/task including the template to render, initial state, etc.
 *
 * @export
 * @interface CardMetaData
 */
interface BaseCardMetaData {
    template: string
    initialState?: CardState
}
  
/**
 * Metadata for a particular card including the template to render, size information, initial state, etc.
 *
 * @export
 * @interface CardMetaData
 */
interface CardMetaData extends BaseCardMetaData {
    size?: number
    title?: string
    description?: string
    icon?: string
    cssClass?: string
}

/**
 * @export
 * @interface CardData
 */
interface CardData extends BaseCardData {
    embeddedTask?: boolean
}

/**
 * @export
 * @interface Recommendation
 */
interface Recommendation extends BaseCardData {}

/**
 * @export
 * @interface TaskData
 */
interface TaskData extends BaseCardData {}

/**
 * @export
 * @interface CatalogueEntry
 */
interface CatalogueEntry {
    id: string
    type: string
    enabled: boolean
}

/**
 * @export
 * @interface PreferenceFilters
 */
interface PreferenceFilters{
    outletId: string,
    period: Period,
    productsBy: ProductsBy
}

/**
 * @export
 * @interface DashboardPreferences
 */
interface DashboardPreferences {
    filters?: PreferenceFilters
}

/**
 * @export
 * @interface DashboardData
 */
interface DashboardData {
    cards: CardData[]
    recommendations: Recommendation[]
    tasks: TaskData[]
    preferences: DashboardPreferences
    catalogue: CatalogueEntry[]
}
  
interface DimensionEntity {
    key: string,
    metadata: string[]
}

interface Dimensions {
    row: DimensionEntity[],
    column: DimensionEntity[]
}

interface Aggregates {
    cell: string[],
    row: string[],
    column: string[],
    table: string[],
}

interface Order {
    dimension: string,
    direction: string, // asc or desc
    metric: string,
    alphabetical: boolean
}

interface Constraint {
    id: string,
    type: string
}

/**
 * @export
 * @interface FormattedPeriod
 */
interface FormattedPeriod {
    start: string,
    end: string
}

/**
 * @export
 * @interface ReportDefinition
 */
interface ReportDefinition {
    dimensions: Dimensions,
    aggregates: Aggregates,
    order: Order[],
    periods: FormattedPeriod[],
    constraints: Constraint[]
    from: number,
    size: number,
}

/**
 * @export
 * @interface PeriodReportData
 */
interface PeriodReportData {
    period: Period,
    current: ReportData,
    previous: ReportData,
    partialPrevious: ReportData
};

/**
 * @export
 * @interface ReportDefinitionOptions
 */
interface ReportDefinitionOptions {
    constraints: Constraint[]
};

/**
 * @export
 * @interface ReportPeriod
 */
interface ReportPeriod {
    start: string,
    end: string,
    granularity: string
};

/**
 * @export
 * @interface ReportQueryData
 */
interface ReportQueryData {
    definition: ReportDefinition,
    period: ReportPeriod,
    options: ReportDefinitionOptions
};


/**
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------
 * |                                                                          |headers.(columns/column_titles)       |aggregates.row_titles                  |
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------
 * |headers.(rows/row_titles/row_ids)     headers.(row_metadata/~_keys)       |rows[0][0] rows[0][1] ...             |aggregates.row[0]                      |
 * |e.g., Main Outlet | Pencil            e.g., 10034 | Boto                  |rows[1][0] rows[1][1] ...             |aggregates.row[1]                      |
 * |      outlet | product                      sku | brand                   |                                      |....                                   |
 * |      outlet_id | product_id                                              |                                      |                                       |
 * |                                                                          |                                      |                                       |
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------
 * |Totals                                                                    |                                      |aggregates.(table_titles/table)        |
 * |---------------------------------------------------------------------------------------------------------------------------------------------------------
 * |aggregates.column_titles                                                  |aggregates  aggregates  aggregates    |
 * |                                                                          | .column[0]  .column[1]  .column[2]...|
 * |                                                                          |                                      |
 * |                                                                          |                                      |
 * |                                                                          |                                      |
 * |                                                                          |                                      |
 * |                                                                          |                                      |
 * ------------------------------------------------------------------------------------------------------------------
 * 
 */

interface ReportDataHeaders {
    columns: any,
    columnTitles: any,
    rows: any,
    rowTitles: any,
    rowIds: any,
    rowMetadata: any,
    rowMetadataKeys: any
}

interface ReportDataAggregates {
    rowTitles: any,
    row: any,
    columnTitles: any,
    column: any,
    tableTitles: any,
    table: any
}

interface ReportDataPeriod {
    start: string,
    end: string,
    denormaliseTime: boolean
}

interface ReportDataCurrency {
    symbol: string
}

/**
 * @export
 * @interface ReportData
 */
interface ReportData {
    rows: any,
    headers: ReportDataHeaders,
    aggregates: ReportDataAggregates,
    periods: ReportDataPeriod[],
    currency: ReportDataCurrency,
    moreResults: boolean
}

interface PerformanceData {
    reportData: PeriodReportData
    chartData: Hash[]
}

interface UserPerformanceData extends PerformanceData {
    totalRevenue: number
    targetRevenue: number
    targetProgressPercent: number
}

/**
 * @export
 * @interface LoadDataOptions
 */
interface LoadDataOptions {
    silent?: boolean
}

/**
 * @export
 * @interface ProductPerformance
 */
interface ProductPerformance {
    product: Hash
    value: number
    currency: boolean
}

/**
 * @export
 * @interface ProductPerformanceData
 */
interface ProductPerformanceData {
    topByCount: ProductPerformance[]
    topByRevenue: ProductPerformance[]
}

/**
 * @export
 * @interface SalesPersonPerformance
 */
interface SalesPersonPerformance {
    user: Hash
    value: number
}