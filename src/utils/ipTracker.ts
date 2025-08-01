/**
 * IP Tracking and Security Utilities
 * Express English Hub - Admin Security System
 */

interface SecurityInfo {
  ip: string;
  timestamp: string;
  userAgent: string;
  location?: string;
}

interface LoginAttempt {
  ip: string;
  timestamp: string;
  success: boolean;
  username?: string;
}

class IPTracker {
  private static instance: IPTracker;
  private loginAttempts: LoginAttempt[] = [];
  private securityLog: SecurityInfo[] = [];

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): IPTracker {
    if (!IPTracker.instance) {
      IPTracker.instance = new IPTracker();
    }
    return IPTracker.instance;
  }

  /**
   * Get current client IP information
   */
  public async getCurrentIP(): Promise<string> {
    try {
      // Try multiple IP detection services
      const services = [
        'https://api.ipify.org?format=json',
        'https://ipapi.co/json/',
        'https://httpbin.org/ip'
      ];

      for (const service of services) {
        try {
          const response = await fetch(service);
          const data = await response.json();
          
          if (data.ip) return data.ip;
          if (data.origin) return data.origin;
        } catch (error) {
          console.warn(`IP service ${service} failed:`, error);
          continue;
        }
      }

      return 'unknown';
    } catch (error) {
      console.error('Failed to get IP:', error);
      return 'unknown';
    }
  }

  /**
   * Log login attempt
   */
  public logLoginAttempt(ip: string, success: boolean, username?: string): void {
    const attempt: LoginAttempt = {
      ip,
      timestamp: new Date().toISOString(),
      success,
      username
    };

    this.loginAttempts.push(attempt);
    
    // Keep only last 100 attempts
    if (this.loginAttempts.length > 100) {
      this.loginAttempts = this.loginAttempts.slice(-100);
    }

    this.saveToStorage();
    
    // Log to console for debugging
    console.log(`Login attempt: ${success ? 'SUCCESS' : 'FAILED'} from ${ip}${username ? ` (${username})` : ''}`);
  }

  /**
   * Log security event
   */
  public logSecurityEvent(ip: string, event: string): void {
    const securityInfo: SecurityInfo = {
      ip,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };

    this.securityLog.push(securityInfo);
    
    // Keep only last 50 security events
    if (this.securityLog.length > 50) {
      this.securityLog = this.securityLog.slice(-50);
    }

    this.saveToStorage();
    console.log(`Security event: ${event} from ${ip}`);
  }

  /**
   * Check if IP has too many failed attempts
   */
  public isIPBlocked(ip: string): boolean {
    const recentAttempts = this.loginAttempts.filter(attempt => {
      const attemptTime = new Date(attempt.timestamp);
      const now = new Date();
      const timeDiff = now.getTime() - attemptTime.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      return attempt.ip === ip && !attempt.success && hoursDiff < 1; // Last hour
    });

    return recentAttempts.length >= 5; // Block after 5 failed attempts in 1 hour
  }

  /**
   * Get login statistics
   */
  public getLoginStats(): {
    totalAttempts: number;
    successfulLogins: number;
    failedAttempts: number;
    uniqueIPs: number;
    recentAttempts: LoginAttempt[];
  } {
    const totalAttempts = this.loginAttempts.length;
    const successfulLogins = this.loginAttempts.filter(a => a.success).length;
    const failedAttempts = totalAttempts - successfulLogins;
    const uniqueIPs = new Set(this.loginAttempts.map(a => a.ip)).size;
    const recentAttempts = this.loginAttempts.slice(-10);

    return {
      totalAttempts,
      successfulLogins,
      failedAttempts,
      uniqueIPs,
      recentAttempts
    };
  }

  /**
   * Validate session security
   */
  public validateSession(): boolean {
    const session = localStorage.getItem('admin_session');
    if (!session) return false;

    try {
      const sessionData = JSON.parse(session);
      const loginTime = new Date(sessionData.loginTime);
      const now = new Date();
      const timeDiff = now.getTime() - loginTime.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      // Session expires after 24 hours
      if (hoursDiff > 24) {
        this.clearSession();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      this.clearSession();
      return false;
    }
  }

  /**
   * Clear session data
   */
  public clearSession(): void {
    localStorage.removeItem('admin_session');
  }

  /**
   * Get security dashboard data
   */
  public getSecurityDashboard() {
    return {
      loginStats: this.getLoginStats(),
      securityLog: this.securityLog.slice(-20),
      sessionValid: this.validateSession()
    };
  }

  private loadFromStorage(): void {
    try {
      const attempts = localStorage.getItem('eeh_login_attempts');
      const security = localStorage.getItem('eeh_security_log');

      if (attempts) {
        this.loginAttempts = JSON.parse(attempts);
      }

      if (security) {
        this.securityLog = JSON.parse(security);
      }
    } catch (error) {
      console.error('Failed to load security data:', error);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('eeh_login_attempts', JSON.stringify(this.loginAttempts));
      localStorage.setItem('eeh_security_log', JSON.stringify(this.securityLog));
    } catch (error) {
      console.error('Failed to save security data:', error);
    }
  }
}

export default IPTracker;
export { IPTracker };