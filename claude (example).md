# Claude Project Instructions for TBD

## Project Overview


## Current Project State
- **Status**: Planning Complete - Ready to Start Development
- **Repository**: `/Users/michael.gitsis/testMG/TBD`
- **GitHub**: https://github.com/michaelgitsis/TBD
- **Supabase Project**: TBD (ID: TBD)
- **Figma Design**: TBD
- **Development Environment**: Docker on port TBD

## Technology Stack
- **Frontend**: Next.js 14+, TypeScript, TailwindCSS, Shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Real-time, Storage)
- **State Management**: React Query (TanStack), Zustand
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Shadcn/ui, Radix UI, Lucide React
- **Charts**: Recharts
- **Authentication**: Supabase Auth with social providers

## User Roles & Access Levels
1. **Super Admin**: Platform administration, tenant management
2. **Company Admin**: Company-level administration 
3. **Property Manager**: Day-to-day operations management
4. **Customer/Property Owner**: Portfolio oversight (read-only access)

## Core Architecture Principles

## Development Workflow

### 1. File Operations
- **Always use absolute paths**: Start with `/Users/michael.gitsis/testMG/TBD/`
- **Use Desktop Commander tools** for file operations (read_file, write_file, list_directory)
- **Follow chunking strategy**: Write files in 25-30 line chunks using write_file with mode 'rewrite' then 'append'

### 2. Task Management
- **NOTE**: We do NOT use Taskmaster for this project
- **Follow task breakdown structure** defined in TASK_BREAKDOWN.md
- **Update task status** manually in TASK_BREAKDOWN.md after completing each sub-task
- **Track progress** through the comprehensive task list and dependencies

### 3. Git Operations
- **Use GitHub MCP** for repository operations
- **Push to git after each completed sub-task**
- **Test functionality before committing**
- **Read and act on CodeRabbit comments**

#### Git Commit Best Practices
- **Email for commits**: gitsis.michael@gmail.com
- **Concise, descriptive messages** (50 chars or less for title)
- **Only push the actual files**, not paste code in commit messages
- **Reference what changed**, not show the entire code

### 4. Database Operations
- **Use Supabase MCP** for database operations
- **Apply migrations** for DDL changes using apply_migration
- **Use execute_sql** for queries and data operations
- **Follow RLS policies** for multi-tenant security

### 5. Documentation & Research
- **Use available MCPs** for enhanced functionality (see MCP list below)
- **Research thoroughly** before implementing new features
- **Document findings** and integrate with project knowledge

## Available MCP Tools

### Database & Backend MCPs
- **Supabase MCP**: Database operations, authentication, real-time subscriptions
  - Execute SQL queries and migrations
  - Manage RLS policies and user permissions
  - Handle file storage and bucket operations
  - Configure authentication providers
  - Set up real-time subscriptions

### Development & Code MCPs
- **GitHub MCP**: Repository management and version control
  - Create, read, update repository files
  - Manage branches, commits, and pull requests
  - Handle issue tracking and project management
  - Review code changes and collaboration

### Research & Documentation MCPs
- **Perplexity MCP**: AI-powered research with citations
  - Get up-to-date information on technologies
  - Research best practices and solutions
  - Find documentation and tutorials
  - Get answers with reliable sources

- **Context7/Docs MCP**: Library and framework documentation
  - Access official documentation for libraries
  - Get API references and examples
  - Find usage patterns and best practices
  - Resolve library-specific questions

- **Firecrawl MCP**: Web scraping and content extraction
  - Extract content from websites
  - Scrape documentation and examples
  - Get structured data from web pages
  - Monitor web content changes

### File & System MCPs
- **Desktop Commander MCP**: Local file system operations
  - Read, write, and manage local files
  - Browse directory structures
  - Execute system commands
  - Manage project file organization

### AI & Automation MCPs
- **n8n MCP**: Workflow automation and AI integration
  - Create automated workflows
  - Set up triggers and actions
  - Integrate with external APIs
  - Build AI-powered automations

### Important Notes
- **Taskmaster is NOT used** in this project
- **Manual task tracking** through TASK_BREAKDOWN.md
- **Leverage MCPs** to enhance development efficiency
- **Document MCP usage** and findings in this file

## Project Status & Next Steps

### Documentation Complete ✅

### Completed Tasks ✅

### Next Tasks


**IMPORTANT**: Always refer to **TASK_BREAKDOWN.md** for the next tasks and detailed requirements.

### Key Features Designed

## Critical Development Workflow

### **MANDATORY Sub-Task Completion Process**
Before moving to ANY next task, you MUST complete this exact sequence:

1. **✅ Build Verification**
   - Run `npm run build` and ensure NO errors
   - Fix any TypeScript compilation errors
   - Resolve any linting issues with `npm run lint`

2. **🧪 Comprehensive Testing**
   - **Backend Testing**: Test all API endpoints using available MCPs
   - **Frontend Testing**: Test UI functionality thoroughly
   - **Database Testing**: Verify all database operations work correctly
   - **Integration Testing**: Test end-to-end functionality
   - **Use MCPs** for automated testing where possible

3. **📤 Git Synchronization**
   - **ONLY** if build and tests are successful:
   - Commit changes with descriptive messages
   - Push to git repository using email: gitsis.michael@gmail.com
   - Sync with remote repository

4. **📋 Task Progress Update**
   - Update task status in TASK_BREAKDOWN.md
   - Mark completed sub-tasks as done
   - Move to next task ONLY after full completion

4. **🐳 Docker Environment**
   - Ensure all services are running properly
   - Rebuild containers if dependencies changed
   - Verify application runs correctly on port TBD

### **Task Navigation**
- **Always check TASK_BREAKDOWN.md** for next tasks
- Follow the exact task order and dependencies
- Never skip the verification process above

## Key Reminders for Claude
1. **Project is starting from scratch** - no code has been written yet
2. **ALWAYS follow the mandatory completion process** above for every sub-task
3. **Never move to next task** until build, tests, and git sync are successful
4. **Follow component reusability patterns** 
5. **Maintain consistent code style** with project specifications
6. **Use absolute paths** for all file operations
7. **Implement proper error handling** and user feedback
8. **Consider mobile responsiveness** in all UI implementations
9. **Follow security best practices** for data access
10. **Apply coding guidelines** to prevent common TypeScript and ESLint errors
11. **Document insights and solutions**: When discovering important bug fixes, workarounds, or technical solutions during development, **immediately update this claude.md file** with the new knowledge to prevent duplicated effort in future development cycles
12. **Self-Learning Protocol**: After resolving any significant error or discovering a pattern:
    - Document the problem and solution in this file under "Common Issues and Prevention Guidelines"
    - Include specific error messages, root causes, and solutions
    - Add preventive measures to avoid similar issues in the future
    - This ensures continuous improvement and knowledge retention across sessions

## Useful MCP Commands for This Project

### Database Operations (Supabase MCP)
```bash
execute_sql             # Run database queries and operations
apply_migration         # Apply schema changes and migrations
generate_typescript_types # Update type definitions from database
setup_rls_policies      # Configure Row Level Security
manage_storage_buckets  # Handle file storage configuration
```

### File Operations (Desktop Commander MCP)
```bash
read_file               # Read project files
write_file              # Write/update files (chunked strategy)
list_directory          # Browse project structure
execute_command         # Run system commands
manage_project_files    # Organize project structure
```

### Repository Operations (GitHub MCP)
```bash
create_or_update_file   # Update files in repository
push_files              # Commit multiple files
get_file_contents       # Read repository files
manage_branches         # Handle branch operations
create_pull_requests    # Manage code reviews
```

### Research & Documentation
```bash
# Perplexity MCP
perplexity_ask          # AI research with citations
get_latest_info         # Current technology information

# Context7/Docs MCP
resolve-library-id      # Find library documentation
get-library-docs        # Get API documentation
find_best_practices     # Get usage patterns

# Firecrawl MCP
scrape_website          # Extract web content
get_documentation       # Scrape docs and examples
```

### Automation & Integration
```bash
# n8n MCP
create_workflow         # Build automation workflows
setup_triggers          # Configure event triggers
integrate_apis          # Connect external services
```

### Development Workflow Commands
```bash
# Initial setup
npm create next-app     # Initialize Next.js project
supabase init          # Setup Supabase project
git init               # Initialize repository

# Development cycle
npm run dev            # Start development server
npm run build          # Build for production
npm test               # Run test suite
npm run lint           # Code quality checks
```


This document serves as the primary reference for Claude when working on the Maisson project. Always refer to this file to understand the project context, current status, and development guidelines.
