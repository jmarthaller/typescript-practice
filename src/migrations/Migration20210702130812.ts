import { Migration } from '@mikro-orm/migrations';

export class Migration20210702130812 extends Migration {

  async up(): Promise<void> {
    // this.addSql('alter table "user" add column "email" text not null;');
    // this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');

    // this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

}